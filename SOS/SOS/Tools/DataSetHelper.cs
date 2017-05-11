using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using MySql.Data.MySqlClient;

namespace SOS.Tools
{
    public class DataSetHelper
    {
        public static string StringConnection
        {
            get { return "Server=localhost;Port=3306;Database=ssifi;Uid=root;Pwd=;"; }
        }

        public static DataSet ExecuteQuery(string strQuery)
        {
            DataSet ds = new DataSet();

            using (MySqlConnection mySqlConnection = new MySqlConnection(StringConnection))
            {
                mySqlConnection.Open();

                using (MySqlDataAdapter dataAdapter = new MySqlDataAdapter(strQuery, mySqlConnection))
                {
                    dataAdapter.Fill(ds);
                }

                mySqlConnection.Close();
            }

            return ds;
        }

        public static int ExecuteCommandNonQuery(string strQuery)
        {
            int rowsAffected = 0;
            using (MySqlConnection mySqlConnection = new MySqlConnection(StringConnection))
            {
                mySqlConnection.Open();

                using (MySqlCommand mySqlCommand = new MySqlCommand(strQuery, mySqlConnection))
                {
                    rowsAffected = mySqlCommand.ExecuteNonQuery();
                }

                mySqlConnection.Close();
            }

            return rowsAffected;
        }

        public static object ExecuteScalar(string strQuery)
        {
            object p_result = null;
            using (MySqlConnection mySqlConnection = new MySqlConnection(StringConnection))
            {
                mySqlConnection.Open();

                using (MySqlCommand mySqlCommand = new MySqlCommand(strQuery, mySqlConnection))
                {
                    p_result = mySqlCommand.ExecuteScalar();
                }

                mySqlConnection.Close();
            }

            return p_result;
        }
    }
}