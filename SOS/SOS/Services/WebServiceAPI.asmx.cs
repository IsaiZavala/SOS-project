using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Data;
using System.Web.Script.Services;

namespace SOS.Services
{
    /// <summary>
    /// Descripción breve de WebServiceAPI
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente. 
    [System.Web.Script.Services.ScriptService]
    public class WebServiceAPI : System.Web.Services.WebService
    {
        [WebMethod]
        public string HelloWorld()
        {
            return "Hola a todos";
        }

        public class Login
        {
            public string userName;
            public string userPassword;
        }

        public class UsuarioClass
        {
            public string idRol;
            public string idUsuario;
            public string NombreUsuario;
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public UsuarioClass verificaUsuario(Login data)
        {
            string strQuery = "SELECT * FROM usuarios WHERE usuario= '@usuario' and pass = '@pass'";
            strQuery = strQuery.Replace("@usuario", data.userName);
            strQuery = strQuery.Replace("@pass", data.userPassword);

            DataSet ds = Tools.DataSetHelper.ExecuteQuery(strQuery);

            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                throw new Exception("No se encontraron registros");
            }

            UsuarioClass usuarioClass = new UsuarioClass();

            usuarioClass.idRol = ds.Tables[0].Rows[0]["idRol"].ToString();
            usuarioClass.idUsuario = ds.Tables[0].Rows[0]["idUsuario"].ToString();
            usuarioClass.NombreUsuario = ds.Tables[0].Rows[0]["usuario"].ToString();

            return usuarioClass;
        }

        [WebMethod]
        public string verificaCadena(string data)
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

            return data;
        }

        public class SOSClass
        {
            public string fechaReporte;
            public string claveCadena;
            public string descripcion;
            public string asunto;
            public string idUsuario;
            public string hraDispI1;
            public string hraDispI2;
            public string hraDispF1;
            public string hraDispF2;
            public string tel;
            public string cel;

            public class informante
            {
                public string celular;
                public string hora1;
                public string hora2;
                public string nombre;
                public string telefono;
            }
        }

        [WebMethod]
        public int SOS(SOSClass data)
        {
            return insertSOS(data);
        }

        public int insertSOS(SOSClass data)
        {
            string strQuery = @"INSERT INTO sos (claveCadena, fecha, idUsuario, descripcion, idStatus, cel, tel, asunto, hraDispI1, hraDispI2, hraDispF1, hraDispF2)
                VALUES ('@claveCadena', '@fecha', @idUsuario, '@descripcion', @idStatus, '@cel', '@tel', '@asunto', '@hraDispI1', '@hraDispI2', '@hraDispF1', '@hraDispF2'); 
                SELECT LAST_INSERT_ID();";

            strQuery = strQuery.Replace("@claveCadena", data.claveCadena);
            strQuery = strQuery.Replace("@fecha", data.fechaReporte);
            strQuery = strQuery.Replace("@idUsuario", data.idUsuario);
            strQuery = strQuery.Replace("@descripcion", data.descripcion);
            strQuery = strQuery.Replace("@idStatus", "1");
            strQuery = strQuery.Replace("@cel", data.cel);
            strQuery = strQuery.Replace("@tel", data.tel);
            strQuery = strQuery.Replace("@asunto", data.asunto);
            strQuery = strQuery.Replace("@hraDispI1", data.hraDispI1);
            strQuery = strQuery.Replace("@hraDispI2", data.hraDispI2);

            if (data.hraDispF1 != string.Empty)
            {
                strQuery = strQuery.Replace("@hraDispF1", data.hraDispF1);
            }
            else
            {
                strQuery = strQuery.Replace("@hraDispF1", "00:00");
            }

            if (data.hraDispF2 != null)
            {
                strQuery = strQuery.Replace("@hraDispF2", data.hraDispF2);
            }
            else
            {
                strQuery = strQuery.Replace("@hraDispF2", "00:00");
            }

            object resultID = Tools.DataSetHelper.ExecuteScalar(strQuery);

            if (resultID != null)
            {
                int.Parse(resultID.ToString());
            }
            
            return -1;
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
            foreach (DataRow dr in ds.Tables[0].Rows)
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

        [WebMethod]
        public static int altaUsuario(Dictionary<string, object> data)
        {
            if (data["idUsuario"] == null)
            {
                return insertaUsuario(data);
            }
            else
            {
                return modificaUsuario(data);
            }
        }

        public static int insertaUsuario(Dictionary<string, object> data)
        {
            string strQuery = @"INSERT INTO usuarios(usuario, pass, idRol) VALUES('@usuario', '@pass', @idRol);
                                SELECT LAST_INSERT_ID();";

            strQuery = strQuery.Replace("@usuario", data["usuario"].ToString());
            strQuery = strQuery.Replace("@pass", data["pass"].ToString());

            Dictionary<string, object> dicRol = data["rol"] as Dictionary<string, object>;

            strQuery = strQuery.Replace("@idRol", dicRol["idRol"].ToString());

            object objResult = Tools.DataSetHelper.ExecuteScalar(strQuery);

            Dictionary<string, object> dirResult = new Dictionary<string, object>();

            if (objResult != null)
            {
                return int.Parse(objResult.ToString());
            }

            return -1;
        }

        public static int modificaUsuario(Dictionary<string, object> data)
        {
            Dictionary<string, object> dicRol = data["rol"] as Dictionary<string, object>;

            string strQuery = @"UPDATE usuarios SET usuario = '@Usuario', pass = '@Pass', idRol = @IdRol
                     /*, NombreUsuario = '@NombreUsuario', correo = '@Correo' */ WHERE idUsuario = @IdUsuario";

            strQuery = strQuery.Replace("@Usuario", data["usuario"].ToString())
                                    .Replace("@Pass", data["pass"].ToString())
                                    .Replace("@NombreUsuario", data["nombre"].ToString())
                                    .Replace("@Correo", data["correo"].ToString())
                                    .Replace("@IdRol", dicRol["idRol"].ToString())
                                    .Replace("@IdUsuario", data["idUsuario"].ToString());

            Tools.DataSetHelper.ExecuteCommandNonQuery(strQuery);

            int IdUsuario;
            int.TryParse(data["idUsuario"].ToString(), out IdUsuario);

            return IdUsuario;
        }

        [WebMethod]
        public static string eliminarUsuario(string id)
        {
            string strQuery = "DELETE FROM usuarios WHERE idUsuario = @IdUsuario";

            strQuery = strQuery.Replace("@IdUsuario", id);

            Tools.DataSetHelper.ExecuteCommandNonQuery(strQuery);
            return "deleted";
        }

        [WebMethod]
        public static List<Dictionary<string, object>> dameUsuariosID(string IdUsuario)
        {
            return getUsuariosRolId(IdUsuario);
        }

        public static List<Dictionary<string, object>> getUsuariosRolId(string IdUsuario)
        {
            string strQuery = "select * FROM usuariorol WHERE idUsuario = @IdUsuario";
            strQuery = strQuery.Replace("@IdUsuario", IdUsuario);

            DataSet ds = Tools.DataSetHelper.ExecuteQuery(strQuery);

            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                throw new Exception("No se encontraron registros para roles para el usuario");
            }

            List<Dictionary<string, object>> lstResult = new List<Dictionary<string, object>>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                Dictionary<string, object> dirResult = new Dictionary<string, object>();
                dirResult.Add("usuario", dr["usuario"]);
                dirResult.Add("pass", dr["pass"]);
                dirResult.Add("NombreUsuario", string.Empty);
                dirResult.Add("correo", string.Empty);

                lstResult.Add(dirResult);
            }

            return lstResult;
        }

        [WebMethod]
        public static int altaEmpleado(Dictionary<string, object> data)
        {
            return insertaEmpleado(data);
        }

        public static int insertaEmpleado(Dictionary<string, object> data)
        {
            string strQuery = @"INSERT INTO empleado(nombreEmpleado, cargo, Activo)
                VALUES('@NombreEmpleado', '@Cargo', @Activo); 
                SELECT LAST_INSERT_ID();";

            strQuery = strQuery.Replace("@NombreEmpleado", data["nombre"].ToString())
                                    .Replace("@Cargo", data["cargo"].ToString())
                                    .Replace("@Activo", "true");

            object objResult = Tools.DataSetHelper.ExecuteScalar(strQuery);

            if (objResult != null)
            {
                return int.Parse(objResult.ToString());
            }

            return -1;
        }

        [WebMethod]
        public static int eliminaEmpleado(string strEmpleado)
        {
            string strQuery = "update empleado SET activo=false WHERE idEmpleado = @IdEmpleado";
            strQuery = strQuery.Replace("@IdEmpleado", strEmpleado);
            Tools.DataSetHelper.ExecuteCommandNonQuery(strQuery);

            int IdEmpleado;
            int.TryParse(strEmpleado, out IdEmpleado);
            return IdEmpleado;
        }

        [WebMethod]
        public static int altaRamo(Dictionary<string, object> data)
        {
            // insertaRamo
            string strQuery = @"INSERT INTO ramo (nombreRamo, Activo) VALUES('@NombreRamo', @Activo);
                                SELECT LAST_INSERT_ID();";

            strQuery = strQuery.Replace("@NombreRamo", data["nombre"].ToString())
                               .Replace("@Activo", "true");

            object objResult = Tools.DataSetHelper.ExecuteScalar(strQuery);

            if (objResult != null)
            {
                int.Parse(objResult.ToString());
            }

            return -1;
        }

        [WebMethod]
        public static string eliminaRamo(int IdRamo)
        {
            return eliminarRamo(IdRamo);
        }

        public static string eliminarRamo(int IdRamo)
        {
            string strQuery = "update ramo SET activo = false WHERE idRamo = @IdRamo";
            strQuery = strQuery.Replace("@IdRamo", IdRamo.ToString());

            Tools.DataSetHelper.ExecuteCommandNonQuery(strQuery);

            return "deleted";
        }

        [WebMethod]
        public static List<Dictionary<string, object>> buzonSOS(Dictionary<string, object> data)
        {
            int bandera = int.Parse(data["bandera"].ToString());
            int IdRol = int.Parse(data["idRol"].ToString());
            string strUsuario = data["idUsuario"].ToString();
            string strQuery = string.Empty;

            switch (IdRol)
            {
                case 1:
                    switch (bandera)
                    {
                        case 1:
                            strQuery = "Select * from infoSOS where IdEstado IN (1,2,3,4)";
                            break;
                        case 2:
                            strQuery = "Select * from infoSOS where IdEstado = 5";
                            break;
                        case 3:
                            strQuery = "Select * from infoSOS where IdEstado = 6";
                            break;
                    }
                    break;
                case 2:
                    switch (bandera) // indica que tipo de id estado quiere traer
                    {
                        case 1:
                            strQuery = "Select * from infoSOS where IdEstado IN (1,2,3,4) and idUsuario = " + strUsuario;
                            break;
                        case 2:
                            strQuery = "Select * from infoSOS where IdEstado = 5 and idUsuario = " + strUsuario;
                            break;
                        case 3:
                            strQuery = "Select * from infoSOS where IdEstado = 6 and idUsuario = " + strUsuario;
                            break;
                    }
                    break;
            }

            DataSet ds = Tools.DataSetHelper.ExecuteQuery(strQuery);

            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                throw new Exception("No se encontraron registros de buzon para el usuario");
            }

            List<Dictionary<string, object>> lstResult = new List<Dictionary<string, object>>();

            foreach (DataRow itemRow in ds.Tables[0].Rows)
            {
                Dictionary<string, object> dicResult = new Dictionary<string, object>();

                dicResult.Add("idDetalleSOS", itemRow["idDetalleSOS"]);
                dicResult.Add("idSOS", itemRow["idSOS"]);
                DateTime fecha;
                DateTime.TryParse(itemRow["fecha"].ToString(), out fecha);
                dicResult.Add("fecha", fecha.ToString("dd/MM/yyyy"));
                dicResult.Add("nombreRamo", itemRow["nombreRamo"]);
                dicResult.Add("Nombre", itemRow["prioridad"]);
                dicResult.Add("color", itemRow["color"]);
                dicResult.Add("asunto", itemRow["asunto"]);
                dicResult.Add("IdEstado", itemRow["IdEstado"]);

                lstResult.Add(dicResult);
            }


            return lstResult;
        }
    }
}
