namespace RealEstateApi.Model
{
    public class SMTPConfigModel
    {
        public string SenderAddress { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Host { get; set; }
        public int Port { get; set; }
    }
}
