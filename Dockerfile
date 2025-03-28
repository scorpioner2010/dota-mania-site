# Етап 1: Базовий образ середовища виконання (ASP.NET Core Runtime)
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app

# Етап 2: Образ SDK для збірки
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY . . 
RUN dotnet restore "dota-mania-site.csproj"
RUN dotnet build "dota-mania-site.csproj" -c Release -o /app/build
RUN dotnet publish "dota-mania-site.csproj" -c Release -o /app/publish

# Етап 3: Фінальний образ
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "dota-mania-site.dll"]