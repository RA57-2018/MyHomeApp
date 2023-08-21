using Npgsql;

namespace RealEstateApi.Infrastructure.Services
{
    public class DatabaseService
    {
        public bool TestPostgreSQLConnection(string connectionString)
        {
            using (var connection = new NpgsqlConnection(connectionString))
            {
                try
                {
                    connection.Open();
                    return true;
                }
                catch (NpgsqlException)
                {
                    return false;
                }
            }
        }
    }
}
