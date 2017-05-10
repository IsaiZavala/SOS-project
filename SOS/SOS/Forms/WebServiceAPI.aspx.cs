using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Script.Services;
using System.Web.Services;
using MySql.Data.MySqlClient;
using System.Data;

namespace SOS.Forms
{
    public partial class WebServiceAPI : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod]
        // [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static IDictionary<object, object> verificaUsuario(IDictionary<string, object> data)
        {
            string strQuery = "SELECT * FROM usuarios WHERE usuario= '@usuario' and pass = '@pass'";

            strQuery = strQuery.Replace("@usuario", data["userName"].ToString());
            strQuery = strQuery.Replace("@pass", data["userPassword"].ToString());

            DataSet ds = Tools.DataSetHelper.ExecuteQuery(strQuery);

            if(ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                throw new Exception("No se encontraron registros");
            }

            Dictionary<object, object> dirResult = new Dictionary<object, object>();

            dirResult.Add("idRol", ds.Tables[0].Rows[0]["idRol"]);
            dirResult.Add("idUsuario", ds.Tables[0].Rows[0]["idUsuario"]);
            dirResult.Add("NombreUsuario", ds.Tables[0].Rows[0]["usuario"]);

            return dirResult;
        }

        [WebMethod]
        public static Dictionary<string, object> verificaCadena(string data)
        {
            // method adapted from models/Cadena.js
            if (data.Length <= 1)
            {
                throw new Exception("La cadena no tiene el formato correcto");
            }

            string edificio = data[0].ToString();
            string strNivel = data[1].ToString();
            int nivel;
            int.TryParse(strNivel, out nivel);

            string strQuery = "select numNiveles from edificio where nombre ='@edificio'";
            strQuery = strQuery.Replace("@edificio", edificio);

            DataSet ds = Tools.DataSetHelper.ExecuteQuery(strQuery);

            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                throw new Exception("No se encontraron registros");
            }

            int numNiveles;
            int.TryParse(ds.Tables[0].Rows[0]["numNiveles"].ToString(), out numNiveles);

            if (nivel > numNiveles)
            {
                throw new Exception("No coincide el numero de niveles");
            }

            Dictionary<string, object> dicResult = new Dictionary<string, object>();
            dicResult.Add("cadenaregresada", data);

            return dicResult;
        }
    }
}