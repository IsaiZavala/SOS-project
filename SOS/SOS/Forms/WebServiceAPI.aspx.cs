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

        [WebMethod]
        public static IDictionary<string, object> SOS(IDictionary<string, object> data)
        {
            return insertSOS(data);
        }

        public static IDictionary<string, object> insertSOS(IDictionary<string, object> data)
        {
            string strQuery = @"INSERT INTO sos (claveCadena, fecha, idUsuario, descripcion, idStatus, cel, tel, asunto, hraDispI1, hraDispI2, hraDispF1, hraDispF2)
                VALUES ('@claveCadena', '@fecha', @idUsuario, '@descripcion', @idStatus, '@cel', '@tel', '@asunto', '@hraDispI1', '@hraDispI2', '@hraDispF1', '@hraDispF2'); 
                SELECT LAST_INSERT_ID();";

            strQuery = strQuery.Replace("@claveCadena", data["claveCadena"].ToString());
            strQuery = strQuery.Replace("@fecha", DateTime.Now.ToString("yyyy/MM/dd"));
            strQuery = strQuery.Replace("@idUsuario", data["idUsuario"].ToString());
            strQuery = strQuery.Replace("@descripcion", data["descripcion"].ToString());
            strQuery = strQuery.Replace("@idStatus", "1");
            strQuery = strQuery.Replace("@cel", data["cel"].ToString());
            strQuery = strQuery.Replace("@tel", data["tel"].ToString());
            strQuery = strQuery.Replace("@asunto", data["asunto"].ToString());
            strQuery = strQuery.Replace("@hraDispI1", data["hraDispI1"].ToString());
            strQuery = strQuery.Replace("@hraDispI2", data["hraDispI2"].ToString());

            if (data.ContainsKey("hraDispF1"))
            {
                strQuery = strQuery.Replace("@hraDispF1", data["hraDispF1"].ToString());
            }
            else
            {
                strQuery = strQuery.Replace("@hraDispF1", "00:00");
            }

            if (data.ContainsKey("hraDispF2"))
            {
                strQuery = strQuery.Replace("@hraDispF2", data["hraDispF2"].ToString());
            }
            else
            {
                strQuery = strQuery.Replace("@hraDispF2", "00:00");
            }

            object resultID = Tools.DataSetHelper.ExecuteScalar(strQuery);

            IDictionary<string, object> dicResult = new Dictionary<string, object>();
            if (resultID != null)
            {
                dicResult.Add("insertId", resultID);
            }
            else
            {
                dicResult.Add("insertId", "-1");
            }

            return dicResult;
        }

        [WebMethod]
        public static List<Dictionary<string, object>> dameUsuarios()
        {
            // method adapted from administracion/dameUsuarios
            return getUsuariosRol();
        }

        public static List<Dictionary<string, object>> getUsuariosRol()
        {
            // method adapted from models/usuarios.js/getUsuariosRol
            string strQuery = "SELECT * FROM usuarioRol";

            DataSet ds = Tools.DataSetHelper.ExecuteQuery(strQuery);

            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                throw new Exception("No se encontraron registros de usuarioRol");
            }

            List<Dictionary<string, object>> lstDic = new List<Dictionary<string, object>>();
            
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                Dictionary<string, object> dicResultado = new Dictionary<string, object>();
                dicResultado.Add("idUsuario", dr["idUsuario"]);
                dicResultado.Add("usuario", dr["usuario"]);
                dicResultado.Add("pass", dr["pass"]);
                // dicResultado.Add("idRol", dr["idRol"]);
                // dicResultado.Add("tipoROl", dr["tipoROl"]);
                dicResultado.Add("descripcion", dr["descripcion"]);
                lstDic.Add(dicResultado);
            }

            return lstDic;
        }

        [WebMethod]
        public static List<Dictionary<string, object>> dameEmpleados()
        {
            return getEmpleado();
        }

        public static List<Dictionary<string, object>> getEmpleado()
        {
            string strQuery = "SELECT * FROM empleado WHERE activo=true";
            DataSet ds = Tools.DataSetHelper.ExecuteQuery(strQuery);

            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                throw new Exception("No se encontraron registros en empleado");
            }

            List<Dictionary<string, object>> lstResultados = new List<Dictionary<string, object>>();
            foreach(DataRow dr in ds.Tables[0].Rows)
            {
                Dictionary<string, object> dirResult = new Dictionary<string, object>();
                dirResult.Add("idEmpleado", dr["idEmpleado"]);
                dirResult.Add("nombreEmpleado", dr["nombreEmpleado"]);
                dirResult.Add("cargo", dr["cargo"]);
                // dirResult.Add("Activo", dr["cargo"]);

                lstResultados.Add(dirResult);
            }

            return lstResultados;
        }

        [WebMethod]
        public static List<Dictionary<string, object>> dameRamos()
        {
            return getRamo();
        }

        public static List<Dictionary<string, object>> getRamo()
        {
            string strQuery = "SELECT * FROM ramo WHERE activo=true";
            DataSet ds = Tools.DataSetHelper.ExecuteQuery(strQuery);

            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                throw new Exception("No se encontraron registros en ramo");
            }

            List<Dictionary<string, object>> lstResult = new List<Dictionary<string, object>>();

            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                Dictionary<string, object> dirResult = new Dictionary<string, object>();
                dirResult.Add("idRamo", dr["idRamo"]);
                dirResult.Add("nombreRamo", dr["nombreRamo"]);
                // dirResult.Add("Activo", dr["Activo"]);
                lstResult.Add(dirResult);
            }

            return lstResult;
        }

        [WebMethod]
        public static List<Dictionary<string, object>> dameRoles()
        {
            return getModelos();
        }

        public static List<Dictionary<string, object>> getModelos()
        {
            string strQuery = "Select * FROM roles";
            DataSet ds = Tools.DataSetHelper.ExecuteQuery(strQuery);

            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                throw new Exception("No se encontraron registros para roles");
            }

            List<Dictionary<string, object>> lstResult = new List<Dictionary<string, object>>();

            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                Dictionary<string, object> dirResult = new Dictionary<string, object>();
                dirResult.Add("idRol", dr["idRol"]);
                dirResult.Add("tipoROl", dr["tipoROl"]);
                dirResult.Add("descripcion", dr["descripcion"]);
                lstResult.Add(dirResult);
            }

            return lstResult;
        }

    }
}