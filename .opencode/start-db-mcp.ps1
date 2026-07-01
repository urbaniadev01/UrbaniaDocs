<#
.SYNOPSIS
    Inicia el MCP server de base de datos urbania-db usando la instalación local.
    Lee la contraseña desde API/.env para evitar hardcoding.
#>

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$envFile = Resolve-Path "$scriptDir\..\API\.env" -ErrorAction Stop

# Leer password del .env
$match = Select-String -Path $envFile -Pattern '^DB_PASSWORD=(.+)' -ErrorAction Stop
$password = $match.Matches[0].Groups[1].Value

if (-not $password) {
    Write-Error "ERROR: No se pudo leer DB_PASSWORD desde $envFile"
    exit 1
}

# Usar la instalación local del paquete (no npx)
$serverPath = "$scriptDir\node_modules\@executeautomation\database-server\dist\src\index.js"

if (-not (Test-Path $serverPath)) {
    Write-Error "ERROR: No se encontró el servidor MCP en $serverPath"
    Write-Error "Ejecuta 'npm install' en .opencode/ primero."
    exit 1
}

# Iniciar el servidor MCP con todos los parámetros
& node $serverPath --postgresql --host localhost --port 5433 --database urbania --user urbania --password $password
exit $LASTEXITCODE
