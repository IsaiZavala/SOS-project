using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Services;
using System.Collections.Specialized;
using System.Web.Script.Services;

namespace SOS.Forms
{
    public partial class Login1 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static IDictionary<object, object> LogearUsuario(IDictionary<string, object> data)
        {
            Dictionary<object, object> dirResult = new Dictionary<object, object>();

            dirResult.Add("idRol", "1");
            dirResult.Add("idUsuario", "1");
            dirResult.Add("NombreUsuario", "rosel");

            return dirResult;
        }
    }
}