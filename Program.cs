using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Налаштування для адмін-інтерфейсу (новий шлях: /admin00987789mania)
var adminPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "admin");
var adminDefaultFilesOptions = new DefaultFilesOptions
{
    FileProvider = new PhysicalFileProvider(adminPath),
    RequestPath = "/kotupidhvist"
};
adminDefaultFilesOptions.DefaultFileNames.Clear();
adminDefaultFilesOptions.DefaultFileNames.Add("index.html");
app.UseDefaultFiles(adminDefaultFilesOptions);
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(adminPath),
    RequestPath = "/kotupidhvist"
});

// Налаштування для клієнтського інтерфейсу
var clientPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "client");
var clientDefaultFilesOptions = new DefaultFilesOptions
{
    FileProvider = new PhysicalFileProvider(clientPath),
    RequestPath = "/kurva"
};
clientDefaultFilesOptions.DefaultFileNames.Clear();
clientDefaultFilesOptions.DefaultFileNames.Add("index.html");
app.UseDefaultFiles(clientDefaultFilesOptions);
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(clientPath),
    RequestPath = "/kurva"
});

// Перенаправлення з кореня на клієнтський інтерфейс
app.MapGet("/", () => Results.Redirect("/kotupidhvist"));

app.Run();