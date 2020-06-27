using System;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace DatingApp.API.Helpers
{
    public static class Extensions
    {

        public static void ApplicationError(this HttpResponse response, string message)
        {
            response.Headers.Add("Application-Error", message);
           response.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin", "*");
        }
        

        public  static void AddPagination(this HttpResponse response, int currentPage, int itemsPerPage,int totalItems, int totalPage)
        {


             var paginationHeader = new PaginationHeader(currentPage, itemsPerPage, totalItems, totalPage);
             var camelCaseFormatter = new JsonSerializerSettings();
             camelCaseFormatter.ContractResolver = new CamelCasePropertyNamesContractResolver();
             response.Headers.Add("Pagination", JsonConvert.SerializeObject(paginationHeader,camelCaseFormatter));
                response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
            //response.Headers.Add("Access-Control-Allow-Origin", "*");
        }

        public static int CalculateAge(this DateTime theDateTime)
        {
            var age = DateTime.Today.Year - theDateTime.Year;
            
            if(theDateTime.AddYears(age) > DateTime.Today)
            {
               age--;

            }
            return age;
        }
    }
}