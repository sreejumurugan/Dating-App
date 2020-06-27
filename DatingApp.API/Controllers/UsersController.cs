
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace DatingApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    
    public class UsersController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;

        public UsersController(IDatingRepository repo, IConfiguration config, IMapper mapper)
        {
            _repo = repo;
            _config = config;
            _mapper = mapper;
        }


        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery]UserParams userParams)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var currentUserFromRepo = await _repo.GetUser(currentUserId);
          
            userParams.UserId = currentUserId;

            if(string.IsNullOrEmpty(userParams.Gender)){

                  userParams.Gender = currentUserFromRepo.Gender == "male" ? "female": "male";
            }
           
            var users = await _repo.GetUsers(userParams);

             var  usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);

             Response.AddPagination(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPage);

            return Ok(usersToReturn);
            
        }


       [HttpGet("{id}", Name="GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {

           
            var users = await _repo.GetUser(id);

            var  userToReturn = _mapper.Map<UserForDetailedDto>(users);

            return Ok(userToReturn);
            
        }

         [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForUpdateDto userForUpdateDto)
        {
           if(id!= int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
           return Unauthorized();
           
            var users = await _repo.GetUser(id);

             _mapper.Map(userForUpdateDto,users);

             if(await _repo.SaveAll())
               return NoContent();

            throw new Exception($"Updating user {id} failed on save");
            
        }


        
    }
}