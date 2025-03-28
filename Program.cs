var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseDefaultFiles();   // Підтримка index.html
app.UseStaticFiles();    // Віддає файли з wwwroot

app.Run();
