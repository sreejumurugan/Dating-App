using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;



namespace DatingApp.API.Controllers
{

    
    
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/users/{userId}/[controller]")]
    [ApiController]
    
    public class MessageController : ControllerBase
    {
         private readonly IDatingRepository _repo;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;

        public MessageController(IDatingRepository repo, IConfiguration config, IMapper mapper)
        {
            _repo = repo;
            _config = config;
            _mapper = mapper;
        }


         [HttpGet("{id}", Name="GetMessage")]
        public async Task<IActionResult> GetMessage(int userId, int id)
        {

           
         if(userId!= int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
           return Unauthorized();
           
            var messageRepo = await _repo.GetMessage(id);

           if(messageRepo == null)
             return NotFound();

            return Ok(messageRepo);
            
        }


           [HttpPost]
        public async Task<IActionResult> CreateMessage (int userId,  MessageForCreationDto messageForCreationDto)
        {

             if(userId!= int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
           return Unauthorized();

            var sender = await _repo.GetUser(userId);

           messageForCreationDto.SenderId = userId;

           var recipient = await _repo.GetUser(messageForCreationDto.RecipientId);

           if(recipient == null)

             return BadRequest("could not found the user");

             var message = _mapper.Map<Message>(messageForCreationDto);

             _repo.Add(message);

             if(await _repo.SaveAll())
             {

                 var messageToReturn = _mapper.Map<MessageToReturnDto>(message);

                   return CreatedAtRoute("GetMessage", new{userId, id =message.Id}, messageToReturn);
             }
             


             throw new Exception("Creating the Message failed on server");
        }

        [HttpGet]

        public async Task<IActionResult> GetMessageForUser(int userId, [FromQuery]MessageParams messageParams)
        {

               if(userId!= int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
           return Unauthorized();
             messageParams.UserId = userId;
           var messageRepo = await _repo.GetMessagesForUser(messageParams);

           var messages = _mapper.Map<IEnumerable<MessageToReturnDto>>(messageRepo);

           Response.AddPagination(messageRepo.CurrentPage, messageRepo.PageSize, messageRepo.TotalCount, messageRepo.TotalPage);
        
           return Ok(messages);
        
        }

          [HttpGet("thread/{recipientId}")]

        public async Task<IActionResult> GetMessageThread(int userId, int recipientId)
        {

               if(userId!= int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
           return Unauthorized();

           var messageRepo = await _repo.GetMessageThread(userId, recipientId);

           var message = _mapper.Map<IEnumerable<MessageToReturnDto>>(messageRepo);

         
           return Ok(message);
        
        }


         [HttpPost("{id}")]
         public async Task<IActionResult> DeleteMessageForUser(int id, int userId)
        {

            if(userId!= int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
           return Unauthorized();

             var messageRepos = await _repo.GetMessage(id);

             if(messageRepos.SenderId == userId)
                messageRepos.SenderDeleted = true;

               if(messageRepos.RecipientId == userId)
                 messageRepos.RecipientDeleted = true;
        
                if(messageRepos.SenderDeleted && messageRepos.RecipientDeleted)
                {
                    _repo.Delete(messageRepos);

                }

                 if(await _repo.SaveAll())
             {

               

                   return NoContent();
             }
        
         throw new Exception("unable to delete the Message failed on server");
        }

          [HttpPost("{id}/read")]
         public async Task<IActionResult> MarkMessageAsRead( int userId ,int id)
        {

            if(userId!= int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
           return Unauthorized();

             var messageRepos = await _repo.GetMessage(id);

             
               if(messageRepos.RecipientId != userId)
                 return Unauthorized();
        
                messageRepos.IsRead = true;
                messageRepos.DateRead = DateTime.Now;
               

                 if(await _repo.SaveAll())
             {

               

                   return NoContent();
             }
        
         throw new Exception("unable to mark as read the Message failed on server");
        }

    }
}