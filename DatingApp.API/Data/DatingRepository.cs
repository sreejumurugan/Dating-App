using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepository
    {


         private readonly DataContext _context;

        public DatingRepository(DataContext context)
        {
            _context = context;

        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
           _context.Remove(entity);
        }

        public async Task<User> GetUser(int id)
        {
           var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

           return user;
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var users =  _context.Users
                        .OrderByDescending(u=>u.LastActive).AsQueryable();
            
           users = users.Where(u => u.Id != userParams.UserId);

           users = users.Where(u => u.Gender == userParams.Gender);

            
             if(userParams.Likers)
            {
               var userLikers = await GetUserLikes(userParams.UserId, userParams.Likers);

               users = users.Where(u => userLikers.Contains(u.Id));
            }

            if(userParams.Likees)
            {
                var userLikees = await GetUserLikes(userParams.UserId, userParams.Likers);

               users = users.Where(u => userLikees.Contains(u.Id));
            }


            

           if(userParams.MinAge !=18 && userParams.MaxAge !=99)
           {

               var minDob = DateTime.Now.AddYears(-userParams.MaxAge-1);
               var maxDob = DateTime.Now.AddYears(-userParams.MinAge);

               users = users.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <=maxDob);

           }

            if(!string.IsNullOrEmpty(userParams.OrderBy))
           {
                switch(userParams.OrderBy)
                {
                    case "created":
                     
                      users =users.OrderByDescending(u=>u.Created);
                      break;

                      default:
                     
                      users =users.OrderByDescending(u=>u.LastActive);

                      break;

                }

               

           }
          


            
           return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }


        private async Task<IEnumerable<int>> GetUserLikes(int id , bool likers)
        {
               var user = await _context.Users.FirstOrDefaultAsync(u => u.Id ==id);

               if(likers)
               {
                       return user.Likers.Where(u => u.LikeeId == id).Select(p=>p.LikerId);
               }
               else{
                   return user.Likees.Where(u => u.LikerId == id).Select(p=>p.LikeeId);
               }

        }
        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

         public async Task<Photo> GetPhoto(int id)
        {
           var photo = await _context.Photos.FirstOrDefaultAsync(u => u.Id == id);

           return photo;
        }

        public Task<Photo> GetMainPhotoForUser(int userId)
        {
            var photo = _context.Photos.Where(x=>x.UserId == userId).FirstOrDefaultAsync(u => u.IsMain);

           return photo;
        }

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.Likes.FirstOrDefaultAsync(u => u.LikerId == userId && u.LikeeId == recipientId);
        }

        public async Task<Message> GetMessage(int id)
        {
             return await _context.Messages.FirstOrDefaultAsync(u => u.Id == id);
        }

         public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
         {
             var messages =  _context.Messages.AsQueryable();
              
              
            switch(messageParams.MessageContainer)
             {

                case "Inbox":

                   messages = messages.Where(x=>x.RecipientId == messageParams.UserId && x.RecipientDeleted== false);
                 break;

                 case "Outbox":

                  messages = messages.Where(x=>x.SenderId == messageParams.UserId && x.SenderDeleted== false);
                 break;

                  default:

                   messages = messages.Where(x=>x.RecipientId == messageParams.UserId && x.IsRead ==false  && x.RecipientDeleted== false);
                    break;

           }

             messages = messages.OrderByDescending(d => d.MessageSent);


           
             return await PagedList<Message>.CreateAsync(messages,
              messageParams.PageNumber, messageParams.PageSize);

         }

        public async Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
             var messages  = await _context.Messages.Where(m=>m.RecipientId== userId && m.RecipientDeleted==false && m.SenderId== recipientId 
             || m.RecipientId== recipientId && m.SenderId== userId && m.SenderDeleted==false )
             .OrderByDescending(p=>p.MessageSent).ToListAsync(); 

             return messages;
        }
    } 
}