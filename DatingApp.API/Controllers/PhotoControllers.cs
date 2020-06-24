

using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.Configuration;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/photos")]
    [ApiController]
    public class PhotoControllers : ControllerBase
    {
        private Cloudinary _cloudinary;

        public IMapper _mapper { get; }
        public IDatingRepository _repo { get; }
        public IOptions<CloudinarySettings> _cloudinaryconfig { get; }

        public PhotoControllers(IDatingRepository repo, IMapper mapper, IOptions<CloudinarySettings> cloudinaryconfig)
        {
           
            _cloudinaryconfig = cloudinaryconfig;
            
            _repo = repo;
            
            _mapper = mapper;


            Account account = new Account(
                _cloudinaryconfig.Value.CloudeName,
                _cloudinaryconfig.Value.ApiKey,
                _cloudinaryconfig.Value.ApiSecret);

           _cloudinary = new Cloudinary(account);
        }



          [HttpGet("{id}", Name= "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {

           
            var photorepo = await _repo.GetPhoto(id);


            var  photo = _mapper.Map<PhotoForReturnDto>(photorepo);

            return Ok(photo);
            
        }

        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId,
        [FromForm] PhotoForCreationDto photoForCreationDto)
        {
               if(userId!= int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                    return Unauthorized();


               var users = await _repo.GetUser(userId);

               var file = photoForCreationDto.File;

               var uploadResult = new ImageUploadResult();

               if(file.Length > 0)
               {

                   using(var stream = file.OpenReadStream())
                   {
                       var uploadParams = new ImageUploadParams(){
                         File = new FileDescription(Guid.NewGuid().ToString(), stream),
                         Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")


                       };

                       uploadResult = _cloudinary.Upload(uploadParams);

                   }

               }
               photoForCreationDto.Url = uploadResult.Url.AbsoluteUri.ToString();
               photoForCreationDto.PublicId =uploadResult.PublicId;
                
              var photo = _mapper.Map<Photo>(photoForCreationDto); 
                
              if(!users.Photos.Any(x=>x.IsMain))
                  photo.IsMain =true;
              
              users.Photos.Add(photo);
            
             if(await _repo.SaveAll())
             {

                 var photoToReturn = _mapper.Map<PhotoForReturnDto>(photo); 

                 return CreatedAtRoute("GetPhoto", new{userId = userId, id= photo.Id}, photoToReturn);

                
             }
                 return BadRequest("Could not add a photo");
        }

          [HttpPost("{id}/setMain")]
        public async Task<IActionResult> AddPhotoForUser(int userId, int id)
        {
               if(userId!= int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                    return Unauthorized();

            var usersRepo = await _repo.GetUser(userId);

            if(!usersRepo.Photos.Any(c => c.Id == id))
             return Unauthorized();

              var photoRepo = await _repo.GetPhoto(id);
              if(photoRepo.IsMain)

               return BadRequest("This is already a main photo");


               var currentMainPhoto = await _repo.GetMainPhotoForUser(userId);

               currentMainPhoto.IsMain = false;
                photoRepo.IsMain = true;
            
             if(await _repo.SaveAll())
               return NoContent();

               return BadRequest("Could not set photo to main ");
        }

        [HttpDelete ("{id}")]
         public async Task<IActionResult> DeletePhotoForUser(int userId, int id)
        {

             if(userId!= int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                    return Unauthorized();

             var usersRepo = await _repo.GetUser(userId);

            if(!usersRepo.Photos.Any(c => c.Id == id))
             return Unauthorized();

               var photoRepo = await _repo.GetPhoto(id);
              if(photoRepo.IsMain)

               return BadRequest("You can not delete your main photo");

              if(photoRepo.PublicId!= null)
              {
                 var deleteParam = new DeletionParams(photoRepo.PublicId);

                 var result = _cloudinary.Destroy(deleteParam);

                    if(result.Result == "ok")
                    {
                        _repo.Delete(photoRepo);
                    }
              }
              else{

                   _repo.Delete(photoRepo);
              }
             

              if(await _repo.SaveAll())

              return Ok();
              
             return BadRequest("Unable to delete ,please try after some time");
        }
    }
}