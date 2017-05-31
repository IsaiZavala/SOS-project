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
            public string pass;
            public string usuario;
            public string nombre;
            public string correo;

            public RolesClass rol;
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
            public string idSOS;
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
            public string fecha;
            public string idStatus;

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

        public class UsuarioRolClass
        {
            public string idUsuario;
            public string usuario;
            public string pass;
            public string descripcion;
            public string correo;
            public string NombreUsuario;
        }

        [WebMethod]
        public List<UsuarioRolClass> dameUsuarios()
        {
            // method adapted from administracion/dameUsuarios
            return getUsuariosRol();
        }

        public List<UsuarioRolClass> getUsuariosRol()
        {
            // method adapted from models/usuarios.js/getUsuariosRol
            string strQuery = "SELECT * FROM usuarioRol";

            DataSet ds = Tools.DataSetHelper.ExecuteQuery(strQuery);

            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                throw new Exception("No se encontraron registros de usuarioRol");
            }

            List<UsuarioRolClass> lstUsuarioRolClass = new List<UsuarioRolClass>();

            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                UsuarioRolClass usuarioRolClass = new UsuarioRolClass();
                usuarioRolClass.idUsuario = dr["idUsuario"].ToString();
                usuarioRolClass.usuario = dr["usuario"].ToString();
                usuarioRolClass.pass = dr["pass"].ToString();
                // dicResultado.Add("idRol", dr["idRol"]);
                // dicResultado.Add("tipoROl", dr["tipoROl"]);
                usuarioRolClass.descripcion = dr["descripcion"].ToString();
                lstUsuarioRolClass.Add(usuarioRolClass);
            }

            return lstUsuarioRolClass;
        }

        public class EmpleadoClass
        {
            public string idEmpleado;
            public string nombreEmpleado;
            public string cargo;
            public string nombre;
        }

        [WebMethod]
        public List<EmpleadoClass> dameEmpleados()
        {
            return getEmpleado();
        }

        public List<EmpleadoClass> getEmpleado()
        {
            string strQuery = "SELECT * FROM empleado WHERE activo=true";
            DataSet ds = Tools.DataSetHelper.ExecuteQuery(strQuery);

            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                throw new Exception("No se encontraron registros en empleado");
            }

            List<EmpleadoClass> lstEmpleado = new List<EmpleadoClass>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                EmpleadoClass empleadoClass = new EmpleadoClass();
                empleadoClass.idEmpleado = dr["idEmpleado"].ToString();
                empleadoClass.nombreEmpleado = dr["nombreEmpleado"].ToString();
                empleadoClass.cargo = dr["cargo"].ToString();
                // dirResult.Add("Activo", dr["cargo"]);

                lstEmpleado.Add(empleadoClass);
            }

            return lstEmpleado;
        }

        public class RamoClass
        {
            public string idRamo;
            public string nombreRamo;
            public string nombre;
        }

        [WebMethod]
        public List<RamoClass> dameRamos()
        {
            return getRamo();
        }

        public List<RamoClass> getRamo()
        {
            string strQuery = "SELECT * FROM ramo WHERE activo=true";
            DataSet ds = Tools.DataSetHelper.ExecuteQuery(strQuery);

            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                throw new Exception("No se encontraron registros en ramo");
            }

            List<RamoClass> lstRamos = new List<RamoClass>();

            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                RamoClass ramoClass = new RamoClass();
                ramoClass.idRamo = dr["idRamo"].ToString();
                ramoClass.nombreRamo = dr["nombreRamo"].ToString();
                // dirResult.Add("Activo", dr["Activo"]);
                lstRamos.Add(ramoClass);
            }

            return lstRamos;
        }

        public class RolesClass
        {
            public string idRol;
            public string tipoROl;
            public string descripcion;
        }

        [WebMethod]
        public List<RolesClass> dameRoles()
        {
            return getModelos();
        }

        public List<RolesClass> getModelos()
        {
            string strQuery = "Select * FROM roles";
            DataSet ds = Tools.DataSetHelper.ExecuteQuery(strQuery);

            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                throw new Exception("No se encontraron registros para roles");
            }

            List<RolesClass> lstRolesClass = new List<RolesClass>();

            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                RolesClass rolesClass = new RolesClass();
                rolesClass.idRol = dr["idRol"].ToString();
                rolesClass.tipoROl = dr["tipoROl"].ToString();
                rolesClass.descripcion = dr["descripcion"].ToString();
                lstRolesClass.Add(rolesClass);
            }

            return lstRolesClass;
        }

        [WebMethod]
        public int altaUsuario(UsuarioClass data)
        {
            if (data.idUsuario == null)
            {
                return insertaUsuario(data);
            }
            else
            {
                return modificaUsuario(data);
            }
        }

        public int insertaUsuario(UsuarioClass data)
        {
            string strQuery = @"INSERT INTO usuarios(usuario, pass, idRol) VALUES('@usuario', '@pass', @idRol);
                                SELECT LAST_INSERT_ID();";

            strQuery = strQuery.Replace("@usuario", data.usuario);
            strQuery = strQuery.Replace("@pass", data.pass);

            RolesClass dicRol = data.rol as RolesClass;

            strQuery = strQuery.Replace("@idRol", dicRol.idRol);

            object objResult = Tools.DataSetHelper.ExecuteScalar(strQuery);

            Dictionary<string, object> dirResult = new Dictionary<string, object>();

            if (objResult != null)
            {
                return int.Parse(objResult.ToString());
            }

            return -1;
        }

        public int modificaUsuario(UsuarioClass data)
        {
            RolesClass dicRol = data.rol as RolesClass;

            string strQuery = @"UPDATE usuarios SET usuario = '@Usuario', pass = '@Pass', idRol = @IdRol
                     /*, NombreUsuario = '@NombreUsuario', correo = '@Correo' */ WHERE idUsuario = @IdUsuario";

            strQuery = strQuery.Replace("@Usuario", data.usuario)
                                    .Replace("@Pass", data.pass)
                                    .Replace("@NombreUsuario", data.nombre)
                                    .Replace("@Correo", data.correo)
                                    .Replace("@IdRol", dicRol.idRol)
                                    .Replace("@IdUsuario", data.idUsuario);

            Tools.DataSetHelper.ExecuteCommandNonQuery(strQuery);

            int IdUsuario;
            int.TryParse(data.idUsuario, out IdUsuario);

            return IdUsuario;
        }

        [WebMethod]
        public string eliminarUsuario(string id)
        {
            string strQuery = "DELETE FROM usuarios WHERE idUsuario = @IdUsuario";

            strQuery = strQuery.Replace("@IdUsuario", id);

            Tools.DataSetHelper.ExecuteCommandNonQuery(strQuery);
            return "deleted";
        }

        [WebMethod]
        public List<UsuarioRolClass> dameUsuariosID(string IdUsuario)
        {
            return getUsuariosRolId(IdUsuario);
        }

        public List<UsuarioRolClass> getUsuariosRolId(string IdUsuario)
        {
            string strQuery = "select * FROM usuariorol WHERE idUsuario = @IdUsuario";
            strQuery = strQuery.Replace("@IdUsuario", IdUsuario);

            DataSet ds = Tools.DataSetHelper.ExecuteQuery(strQuery);

            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                throw new Exception("No se encontraron registros para roles para el usuario");
            }

            List<UsuarioRolClass> lstUsuarioRolClass = new List<UsuarioRolClass>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                UsuarioRolClass usuarioRolClass = new UsuarioRolClass();
                usuarioRolClass.usuario = dr["usuario"].ToString();
                usuarioRolClass.pass = dr["pass"].ToString();
                usuarioRolClass.NombreUsuario = string.Empty;
                usuarioRolClass.correo = string.Empty;

                lstUsuarioRolClass.Add(usuarioRolClass);
            }

            return lstUsuarioRolClass;
        }

        [WebMethod]
        public int altaEmpleado(EmpleadoClass data)
        {
            return insertaEmpleado(data);
        }

        public int insertaEmpleado(EmpleadoClass data)
        {
            string strQuery = @"INSERT INTO empleado(nombreEmpleado, cargo, Activo)
                VALUES('@NombreEmpleado', '@Cargo', @Activo); 
                SELECT LAST_INSERT_ID();";

            strQuery = strQuery.Replace("@NombreEmpleado", data.nombre)
                                    .Replace("@Cargo", data.cargo)
                                    .Replace("@Activo", "true");

            object objResult = Tools.DataSetHelper.ExecuteScalar(strQuery);

            if (objResult != null)
            {
                return int.Parse(objResult.ToString());
            }

            return -1;
        }

        [WebMethod]
        public int eliminaEmpleado(string strEmpleado)
        {
            string strQuery = "update empleado SET activo=false WHERE idEmpleado = @IdEmpleado";
            strQuery = strQuery.Replace("@IdEmpleado", strEmpleado);
            Tools.DataSetHelper.ExecuteCommandNonQuery(strQuery);

            int IdEmpleado;
            int.TryParse(strEmpleado, out IdEmpleado);
            return IdEmpleado;
        }

        [WebMethod]
        public int altaRamo(RamoClass data)
        {
            // insertaRamo
            string strQuery = @"INSERT INTO ramo (nombreRamo, Activo) VALUES('@NombreRamo', @Activo);
                                SELECT LAST_INSERT_ID();";

            strQuery = strQuery.Replace("@NombreRamo", data.nombre)
                               .Replace("@Activo", "true");

            object objResult = Tools.DataSetHelper.ExecuteScalar(strQuery);

            if (objResult != null)
            {
                int.Parse(objResult.ToString());
            }

            return -1;
        }

        [WebMethod]
        public string eliminaRamo(int IdRamo)
        {
            return eliminarRamo(IdRamo);
        }

        public string eliminarRamo(int IdRamo)
        {
            string strQuery = "update ramo SET activo = false WHERE idRamo = @IdRamo";
            strQuery = strQuery.Replace("@IdRamo", IdRamo.ToString());

            Tools.DataSetHelper.ExecuteCommandNonQuery(strQuery);

            return "deleted";
        }

        public class BuzonSOSClass
        {
            public string bandera;
            public string idRol;
            public string idUsuario;
            public string asunto;
            public string color;
            public string fecha;
            public object idDetalleSOS;
            public string idSOS;
            public string nombreRamo;
            public string prioridad;

            public string IdEstado;
            public string Nombre;
        }

        [WebMethod]
        public List<BuzonSOSClass> buzonSOS(BuzonSOSClass data)
        {
            int bandera = int.Parse(data.bandera);
            int IdRol = int.Parse(data.idRol);
            string strUsuario = data.idUsuario;
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
                // throw new Exception("No se encontraron registros de buzon para el usuario");
                return new List<BuzonSOSClass>();
            }

            List<BuzonSOSClass> lstBuzonSOSClass = new List<BuzonSOSClass>();

            foreach (DataRow itemRow in ds.Tables[0].Rows)
            {
                BuzonSOSClass buzonSOSClass = new BuzonSOSClass();

                buzonSOSClass.idDetalleSOS = itemRow["idDetalleSOS"].ToString();
                buzonSOSClass.idSOS = itemRow["idSOS"].ToString();
                DateTime fecha;
                DateTime.TryParse(itemRow["fecha"].ToString(), out fecha);
                buzonSOSClass.fecha = fecha.ToString("dd/MM/yyyy");
                buzonSOSClass.nombreRamo = itemRow["nombreRamo"].ToString();
                buzonSOSClass.Nombre = itemRow["Nombre"].ToString();
                buzonSOSClass.prioridad = itemRow["prioridad"].ToString();
                buzonSOSClass.color = itemRow["color"].ToString();
                buzonSOSClass.asunto = itemRow["asunto"].ToString();
                buzonSOSClass.IdEstado = itemRow["IdEstado"].ToString();

                lstBuzonSOSClass.Add(buzonSOSClass);
            }

            return lstBuzonSOSClass;
        }


        public class InfoDetalleClass
        {
            public string idDetalleSOS;
            public string prioridad;
            public string idPrioridad;
            public string color;
            public string nombreRamo;
            public string idRamo;
            public string tipoMantenimiento;
            public string idTipoMant;
            public string nombreEmpleado;
            public string idEmpleado;
            public string cargo;
            public string comentarios;
            public string IdSOS;
        }

        [WebMethod]
        public List<InfoDetalleClass> GetDetalle(int IdSOS)
        {
            string strQuery = "Select * from infodetalle where  IdSOS = @IdSOS";
            strQuery = strQuery.Replace("@IdSOS", "" + IdSOS);

            DataSet ds = Tools.DataSetHelper.ExecuteQuery(strQuery);

            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                // throw new Exception("No se encontraron registros para infodetalle");
                return new List<InfoDetalleClass>();
            }

            List<InfoDetalleClass> lstInfoDetalle = new List<InfoDetalleClass>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                InfoDetalleClass infoDetalle = new InfoDetalleClass();
                infoDetalle.idDetalleSOS = dr["idDetalleSOS"].ToString();
                infoDetalle.prioridad = dr["prioridad"].ToString();
                infoDetalle.idPrioridad = dr["idPrioridad"].ToString();
                infoDetalle.color = dr["color"].ToString();
                infoDetalle.nombreRamo = dr["nombreRamo"].ToString();
                infoDetalle.idRamo = dr["idRamo"].ToString();
                infoDetalle.tipoMantenimiento = dr["tipoMantenimiento"].ToString();
                infoDetalle.idTipoMant = dr["idTipoMant"].ToString();
                infoDetalle.nombreEmpleado = dr["nombreEmpleado"].ToString();
                infoDetalle.idEmpleado = dr["idEmpleado"].ToString();
                infoDetalle.cargo = dr["cargo"].ToString();
                infoDetalle.comentarios = dr["comentarios"].ToString();
                infoDetalle.IdSOS = dr["IdSOS"].ToString();

                lstInfoDetalle.Add(infoDetalle);
            }

            return lstInfoDetalle;
        }

        public class PrioridadClass
        {
            public string idPrioridad;
            public string prioridad;
            public string color;
        }

        [WebMethod]
        public List<PrioridadClass> getPrioridad()
        {
            string strQuery = "SELECT * FROM prioridad";

            DataSet ds = Tools.DataSetHelper.ExecuteQuery(strQuery);

            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                throw new Exception("No se encontraron registros para prioridad");
            }

            List<PrioridadClass> lstPrioridad = new List<PrioridadClass>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                PrioridadClass prioridadClass = new PrioridadClass();
                prioridadClass.idPrioridad = dr["idPrioridad"].ToString();
                prioridadClass.prioridad = dr["prioridad"].ToString();
                prioridadClass.color = dr["color"].ToString();

                lstPrioridad.Add(prioridadClass);
            }

            return lstPrioridad;
        }

        public class EstadosSOSClass
        {
            public string IdEstado;
            public string Nombre;
        }

        [WebMethod]
        public List<EstadosSOSClass> getEstados()
        {
            string strQuery = "select * from estadosos";

            DataSet ds = Tools.DataSetHelper.ExecuteQuery(strQuery);
            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                throw new Exception("No se encontraron registros para estadosos");
            }

            List<EstadosSOSClass> lstEstadosSOS = new List<EstadosSOSClass>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                EstadosSOSClass estadoSOS = new EstadosSOSClass();
                estadoSOS.IdEstado = dr["IdEstado"].ToString();
                estadoSOS.Nombre = dr["Nombre"].ToString();

                lstEstadosSOS.Add(estadoSOS);
            }

            return lstEstadosSOS;
        }

        [WebMethod]
        public List<SOSClass> getSOSID(int IdSOS)
        {
            string strQuery = "Select * from sos where idSOS = @IdSOS";
            strQuery = strQuery.Replace("@IdSOS", "" + IdSOS);

            DataSet ds = Tools.DataSetHelper.ExecuteQuery(strQuery);

            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                return new List<SOSClass>();
            }

            List<SOSClass> lstSOSClass = new List<SOSClass>();

            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                SOSClass sosClass = new SOSClass();
                sosClass.idSOS = dr["idSOS"].ToString();
                sosClass.claveCadena = dr["claveCadena"].ToString();
                sosClass.fecha = dr["fecha"].ToString();
                sosClass.idUsuario = dr["idUsuario"].ToString();
                sosClass.descripcion = dr["descripcion"].ToString();
                sosClass.idStatus = dr["idStatus"].ToString();
                sosClass.cel = dr["cel"].ToString();
                sosClass.tel = dr["tel"].ToString();
                sosClass.asunto = dr["asunto"].ToString();
                sosClass.hraDispI1 = dr["hraDispI1"].ToString();
                sosClass.hraDispI2 = dr["hraDispI2"].ToString();
                sosClass.hraDispF1 = dr["hraDispF1"].ToString();
                sosClass.hraDispF2 = dr["hraDispF2"].ToString();

                lstSOSClass.Add(sosClass);
            }

            return lstSOSClass;
        }


        public class TipoMantenimientoClass
        {
            public string idTipoMant;
            public string tipoMantenimiento;
        }


        [WebMethod]
        public List<TipoMantenimientoClass> tipoMantenimiento()
        {
            return getTipoMant();
        }

        public List<TipoMantenimientoClass> getTipoMant()
        {
            string strQuery = "SELECT * FROM tipomantenimiento";
            DataSet ds = Tools.DataSetHelper.ExecuteQuery(strQuery);

            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                return new List<TipoMantenimientoClass>();
            }
            
            List<TipoMantenimientoClass> lstTipoMantenimiento = new List<TipoMantenimientoClass>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                TipoMantenimientoClass tipoMantenimiento = new TipoMantenimientoClass();
                tipoMantenimiento.idTipoMant = dr["idTipoMant"].ToString();
                tipoMantenimiento.tipoMantenimiento = dr["tipoMantenimiento"].ToString();

                lstTipoMantenimiento.Add(tipoMantenimiento);
            }

            return lstTipoMantenimiento;
        }

        public class OrdenTrabajoClass
        {
            public string idOT;
            public string idSOS;
            public string idDetalleSOS;
            public string accion;
            public string operario;
            public string fecha;
            public string hraIniOT;
            public string instruccion;
            public string hraAtencion;
            public string reporte;
        }

        [WebMethod]
        public List<OrdenTrabajoClass> ordenTrabajo(int IdSOS)
        {
            return getOTs(IdSOS);
        }

        public List<OrdenTrabajoClass> getOTs(int IdSOS)
        {
            string strQuery = "Select * from ordentrabajo where idSOS = @IdSOS";
            strQuery = strQuery.Replace("@IdSOS", "" + IdSOS);

            DataSet ds = Tools.DataSetHelper.ExecuteQuery(strQuery);

            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
            {
                return new List<OrdenTrabajoClass>();
            }

            List<OrdenTrabajoClass> lstOrdenTrabajo = new List<OrdenTrabajoClass>();
            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                OrdenTrabajoClass ordenTrabajo = new OrdenTrabajoClass();
                ordenTrabajo.idOT = dr["idOT"].ToString();
                ordenTrabajo.idSOS = dr["idSOS"].ToString();
                ordenTrabajo.idDetalleSOS = dr["idDetalleSOS"].ToString();
                ordenTrabajo.accion = dr["accion"].ToString();
                ordenTrabajo.operario = dr["operario"].ToString();
                ordenTrabajo.fecha = dr["fecha"].ToString();
                ordenTrabajo.hraIniOT = dr["hraIniOT"].ToString();
                ordenTrabajo.instruccion = dr["instruccion"].ToString();
                ordenTrabajo.hraAtencion = dr["hraAtencion"].ToString();
                ordenTrabajo.reporte = dr["reporte"].ToString();

                lstOrdenTrabajo.Add(ordenTrabajo);
            }

            return lstOrdenTrabajo;
        }

    }
}
