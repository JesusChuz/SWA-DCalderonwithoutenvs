# MyWorkspace wiki

MyWorkspace is an advanced self-service application providing users the ability to build any environment setup on the cloud and provision replicas on demand. `MyWorkspace Service` provides a robust catalog containing reference architectures built by product experts for rapid deploy and instantaneous use.  For unique custom scenarios not contained in the catalog, MyWorkspace provides a designer that allows the user to outline and deploy what objects they require.


## Table of Contents
- [VMASVNext](#VMASVNext)
    - [Table of Contents](#table-of-contents)
    - [Onboarding](#onboarding)
    - [Common Libraries](#common-libraries)
        - [How to install](#how-to-install)
        - [AppConfiguration](#appconfiguration)
        - [AzureServiceBus](#azureserviceBus)
        - [Cache](#cache)
        - [HttpClientService](#httpclientservice)
        - [HttpExtensions](#httpextensions)
        - [Shared Library](#shared-library)
        - [Storage](#storage)
        - [Telemetry](#Telemetry)
    - [My Workspace services](#my-workspace-services)
        - [AuthService](#authservice)
        - [NotificationService](#notificationservice)
        - [Catalog](#catalog)
        - [FirewallManager](#firewallmanager)
        - [FrontEnd](#frontend)
        - [Gateway](#gateway)
        - [Jobs](#jobs)
        - [ProvisioningEngine](#provisioningengine)
		- [ResourceProvisioningService](#resourceprovisioningservice)
		- [TaskManagementService](#taskmanagementservice)
    - [License](#license)
    - [Privacy](#privacy)

---

## Onboarding

**Clone Repository**

 Be sure to get the latest version Git for Windows

[Online link](https://microsoftit.visualstudio.com/DefaultCollection/OneITVSO/_git/E36-MWS-MW-MyWorkspace)

[Clone in VS code](vscode://vscode.git/clone?url=https://microsoftit.visualstudio.com/OneITVSO/_git/E36-MWS-MW-MyWorkspace)



Define these environment variables in Windows, obtain values from Azure service principal

```markdown
$Env:APP_CONFIG_CONNECTION_STRING
$Env:AZURE_CLIENT_ID =
$Env:AZURE_CLIENT_SECRET =
$Env:AZURE_TENANT_ID = 
```

---
## Common Libraries

## How to install

To use these **Libraries** in `Visual Studio` you will need to complete the following:

1. On the Tools menu, select Options > NuGet Package Manager > Package Sources. Select the green plus in the upper-right corner and enter the name and source URL below.

Name
```markdown
E36-MWS-CloudEngandAnalytics
```
Source
```markdown
https://pkgs.dev.azure.com/MicrosoftIT/OneITVSO/_packaging/E36-MWS-CloudEngandAnalytics/nuget/v3/index.json
```

**Note**: You need to do this on every machine that needs access to your packages. Use the NuGet.exe instructions if you want to complete setup once and check it into your repository.

2. On the Tools menu, select Options > NuGet Package Manager > Manager NuGet Package for Solution. Filter 'E36-MWS-CloudEngandAnalytics' in the Package Source and search for 'MyWorkspace' in the search box. Select the libraries and the projects in which you would like to install the libraries and press Install.

**Restore packages** On the Tools menu, select Options > NuGet Package Manager > Package Manager Console. Find a package you want to use, copy the Package Manager command, and paste it in the Package Manager Console.

```markdown
Install-Package Microsoft.Vmas.Common.<< Name >> -version << # >>
```

Examples:
```markdown
PM> Install-Package Microsoft.Vmas.Common.AppConfiguration -version 12.2010.15.1818
```

## Visual Studio local setup for FrontEnd


Install the following extensions:

[Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
is an opinionated code formatter. It enforces a consistent style by parsing your code and re-printing it with its own rules that take the maximum line length into account, wrapping code when necessary.

[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) is a static code analysis tool for identifying problematic patterns.

### Setting up Prettier as the formatter
Default Formatter

To ensure that this extension is used over other extensions you may have installed, be sure to set it as the default formatter in your VS Code settings. This setting can be set for all languages or by a specific language.
```markdown
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```
## Format On Save

Respects editor.formatOnSave setting.

You can turn on format-on-save on a per-language basis by scoping the setting:
```markdown
// Set the default
"editor.formatOnSave": true
```

For More info [here](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

---

## AppConfiguration


**Definitions**
-	`.NET 5.0` unified .NET SDK experience, with a single base class library across all .NET 5 applications. The ASP.NET Core Runtime enables you to run existing web/server applications
-	Azure App Configuration is an Azure service that allows users to manage configuration within the cloud. Users can create App Configuration stores to store key-value settings and consume stored settings from within applications, deployment pipelines, release processes, microservices, and other Azure resources.

A class library defines types and methods that are called by an application. A class library that targets .NET Standard 2.0 allows your library to be called by any .NET implementation that supports that version of .NET Standard.

`Azure App Configuration` provides a service to centrally manage application settings and feature flags. Modern programs, especially programs running in a cloud, have many components that are distributed in nature. Spreading configuration settings across these components can lead to hard-to-troubleshoot errors during an application deployment. Use App Configuration to store all the settings for your application and secure their accesses in one place.

 It's a common practice to organize keys into a hierarchical namespace by using a character delimiter, such as / or :. Use a convention best suited to your application.

```markdown
 AppName:Service1:ApiEndpoint
 AppName:Service2:ApiEndpoint
```

**Dependencies** 

```markdown
Microsoft.Extensions.Configuration
Microsoft.Extensions.Configuration.Abstractions
Microsoft.Extensions.Configuration.AzureAppConfiguration
Microsoft.Vmas.Common.AppConfiguration
Microsoft.Vmas.Common.Shared
Newtonsoft.Json
```

**Environnent Variables (From Azure service principal)** 

```markdown
$Env:APP_CONFIG_CONNECTION_STRING
$Env:AZURE_CLIENT_ID =
$Env:AZURE_CLIENT_SECRET =
$Env:AZURE_TENANT_ID = 
```

**How to consume the library**
```markdown
using Microsoft.Vmas.Common.AppConfiguration;

IAppConfiguration appconfig = new AppConfiguration(Connection string);

#Configuration settings from App configuration, whether it is linked or not to a Keyvault.

IConfigSetting setting = conn.GetConfigSetting(KeyValue);

#Feature Flag setting from App configuration.

Open Startup.cs and update the Configure and ConfigureServices methods to add app.UseAzureAppConfiguration() and services.AddFeatureManagement().
Open program and update the CreateHostBuilder method adding webBuilder.AppConfigurationFeatureFlags(Connection string) before webBuilder.UseStartup<Startup>().

To use the Feature Flag, add Microsoft.FeatureManagement reference. A common pattern of feature management is to check if a feature flag is set to on and if so, run a section of code. For example:
```markdown
IFeatureManager featureManager;
...
if (await featureManager.IsEnabledAsync("Feature"))
{
    // Run the following code
}
```

#Cast any type using GetConfigSettingValue

string s = conn.GetConfigSettingValue<string>("keyValue");
bool  b = conn.GetConfigSettingValue<bool>("keyValue");

#Get a List of key Values using GetConfigSettingList. (Content Type should be application/json and key name should have a hierarchical namespace E.g. Settings:color1, Settings:color2 )

List<string> mySettings = conn.GetConfigSettingList<string>("Settings");

**Boolean value:** 
```
FeatureFlag.Enabled
```

---

## AzureServiceBus

The Azure Service Bus reads and sends messages to a service bus in Azure.


### Usage

To add the message sender service on startup, simply call the following extension method on the services collection with a MessageSenderSettings argument:

```
...
services.AddMessageSender(<< MessageSenderSettings here>>)
...
```

Then, inject the IMessageSender into a class and use the SendAsync function where appropriate.

To add the message receiver service on startup, simply call the following extension method on the services collection with a MessageReceiverSettings argument:

```
...
services.AddMessageReceiver(<< MessageReceiverSettings here>>)
...
```

This assumes that there is an implemetation of IMessageReceiverFunctions already in services.

IMessageReceiverFunctions specifies the functions to perform when receiving a message.

Then, inject the IMessageReceiver into a class and use the StartProcessing method to begin processing.


---

## Cache

### Usage

```
 Task SetStringAsync(string key, string value);
```
 Sets a string in the cache with the default cache expiry time.
```
Task<string> GetValueAsync(string key);
```
 Gets a cache value from the cache.
```
Task<bool> KeyExistsAsync(string key);
```
Checks for the existence of the key in the cache.
```
Task<bool> DeleteKeyAsync(string key);
```
Deletes a key from the cache.

```
Task SetStringAsync(string key, string value, TimeSpan cacheExpiryTime);
```
Sets a string in the cache with the specified cache expiry time.

---
## HttpClientService

The HttpClientService is an injectable, typed HTTP client that has standard configuration for all web requests. The service is configured for:

- Robust Polly logic
-- Idempotent operations automatically retry, otherwise they do not. Everything has a timeout, circuit breaker, and caching
-- Defaults for timeout and circuit breaker can be overridden
- One client per object type and API via a generic (HttpClientService<T1, T2>)
- Memory saving via using streams
- No socket issues by using HttpClientFactory (behind the DI scenes)
- Either optionally using XML or JSON (defualt) for requests
- GZIP compression
- Logging on errors
- Standard request types, including:
-- GET
-- POST
-- DELETE
-- PUT
-- PATCH
- Some additional request types, including:
-- GET for an enumerable of objects
-- POST for an enumerable of objects

### Usage

To add the service on startup, simply call the following extension method on the services collection with a base URI string argument:

```
...
services.AddHttpClientService<T1, T2>(<<Telemtry client for logging>>, <<Base URI string>>)
...
```

Where T1 is the desired API (implementing IApi) and T2 is the desired object type.

At the moment, T1 does not do anything. It is simply a way to specify between multiple HttpClientService instances of the same type T2.
It is sufficient to define a blank class to fulfill typing and that's it:

```
class ResourceApi : IApi{
}
```

In the future, T1 may be useful for API-level optoins.

The client can be created via injection into some service, e.g.:

```
class ExampleRepository{
	private IRestClientService<ResourceApi, Workspace> restClientService;

	ExampleRepository(HttpClientService<ResourceApi, Workspace> injectedService){
		restClientService = injectedService
	}
}
```

And it can then be used via its exposed methods, e.g.:


```
restClientService.PostAsync("/", workspace, cancellationToken);

Workspace workspace = restClientService.GetAsync($"/{workspace.ID}", cancellationToken);

restClientService.DeleteAsync($"/{workspace.ID}", cancellationToken);
```

T2 can also be omitted when the service is injected, and instead be added to the individual calls. This allows the same client to be used for different types.

No other configuration is necessary unless specific options are desired. In that case, it is possible to not use the extension method and instead inject the service manually.

If you are injecting the service manually and not via extension, make sure to configure GZIP decompression automatically and robust Polly handling.

---
## HttpExtensions


### Usage

Adds required services to support the Correlation ID functionality to the IServiceCollection.
```
AddCorrelationId(this IServiceCollection services, Action<CorrelationIdOptions> configure)
```



---
## Shared Library

---

## Storage

### Usage

Initialize a DocumentDB data store with the provided database name. Task<bool>
```
CreateDatabaseIfNotExistsAsync(string databaseName, CancellationToken cancellationToken = default);
```

Creates a container with the provided name and throughput if it doesn't exist already. Task<bool> 
```
CreateContainerIfNotExistsAsync(string databaseName, string containerName, string[] pathsToIncludeForIndexing, string[] pathsToExcludeFromIndexing, int? throughput, CancellationToken cancellationToken = default);
```


Registers a new stored procedure within a container, deletes older on if it already exists. Task<bool> 
```
RegisterContainerStoredProcedureAsync(string databaseName, string containerName, string sprocId, string sprocPath, CancellationToken cancellationToken = default);
```

 Get a single row result based on the partitionkey and unique id from a container. Task<T> 
he request.

```
GetByIdAsync<T>(string databaseName, string containerName, string id, CancellationToken cancellationToken = default)
            where T : DocumentBaseModel;
```


Get all queried results from a container and partitionkey. Task<IEnumerable<T>> 
```
GetAllAsync<T>(string databaseName, string containerName, QueryDefinition sql, CancellationToken cancellationToken = default)
            where T : class;
```

Get all queried results from a container and partitionkey. Task<IEnumerable<T>> 
```
GetAllAsync<T>(string databaseName, string containerName, Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default)
            where T : DocumentBaseModel;
```

Get paged query results from a container and partitionkey. Task<PageResult<T>>
```       
GetPagedResultsAsync<T>(string databaseName, string containerName, QueryDefinition sql, CancellationToken cancellationToken, string continuationToken = default)
            where T : DocumentBaseModel;
```

Create a document in a container. Task<string> 
```
CreateDocumentAsync<T>(string databaseName, string containerName, T document, CancellationToken cancellationToken = default)
            where T : DocumentBaseModel;
```

Replace a document in a container. Task<string> 
```
ReplaceDocumentAsync<T>(string databaseName, string containerName, T document, CancellationToken cancellationToken = default)
            where T : DocumentBaseModel;
```

 Delete a document in a container. Task
```
 DeleteDocumentAsync(string databaseName, string containerName, string documentId, string partitionKeyValue, CancellationToken cancellationToken = default);
```

 Executes a stored procedure within a container.Task<string> 
```
ExecuteContainerStoredProcedureAsync(string databaseName, string containerName, string partitionKeyValue, string sprocId, dynamic[] parameters, CancellationToken cancellationToken = default);
```


---
## Shared Library

---
## Telemetry
The telemetry package is a UTP compliant telemetry package that allows for easy management of telemetry and context. By using this package, it allows for more consistent telemetry to be emitted. This allows for easier usage of the telemetry as well as removing the overhead of maintaining consistency.

###Telemetry Contexts
These classes implement the ITelemetryContext interface. Contexts hold information about telemetry and a set of Telemetry Loggers.
The goal of this interface is to emit telemetry when requested and automatically add all the information from the context to the telemetry.

####TelemetryContext
This is the most basic implementation of the ITelemetryContext interface. It includes a minimum implementation of the interface to manage the information stored in the context. This is the context that should be used when there are no special properties that are required for the context.

-	Creating a Context from the Constructor:
	```	
	new TelemetryContext(
		new List<ITelemetryLogger>() { << List of loggers >> },
		<< Parent Context >>,
		<< Optional Dictionary of Properties >> );
	```
	
-	Creating a Child Context of this type:\
	This will copy all of the loggers and properties out of the parent and copy them into the child. If the optional properties or loggers are provided they will overwrite the parent.
	```	
	parentContext.CreateChildContext(
		TelemetryContext.BuildConstructor(),
		<< Optional Dictionary of Properties >>,
		<< Optional List of Loggers >> );
	```
	
-	Adding Properties to existing Contexts:\
	This util function is used to add properties to existing contexts without having to modify the dictionary inside of the propertie manually. There are some checks here that ensure illegal operations will not crash the service as well. This util function can be used for any context that is a child of this base class as well.\
	```context.AddProperty( << Key >>, << Value >>, << PPI Flag >>);```
	
-	Emit Telemetry from a context:\
	```context.EmitTelemtry(<< Telemetry Message >>);```\
	This is how to emit telemetry from a context with the context's properties automatically added. To choose what type of telemetry to add just change what type of telemetry message is being emitted. To determine which metric to use the following page can be viewed. [Link](https://docs.microsoft.com/en-us/azure/azure-monitor/app/api-custom-events-metrics)
	-	Telemetry Event Message\
		```new TelemetryEventMessage(<< Event Name >>, << Optional Properties >>)```
	-	Telemetry Metric Message\
		```new TelemetryMetricMessage(<< Metric Name >>, << Metric Value >>, << Optional Dimensions >>, <<Optional Dimenision Values >>, << Optional Metric Namespace >>)```
	- 	Telemetry Request Message\
		```new TelemetryRequestMessage(<< Event Name>>, << Start Time >>, << Duration of Request >>, << Optional Source >>, << Optional Response Code >>, << Optional Success Value >>)```
	-	Telemetry Exception Message\
		```new TelemetryExceptionMessage(<< Event Name >>, << Exception >>, << Optional Properties >>)```

####TelemetryMetricObserverContext
This is an extension of the TelemetryContext class. This class adds one key features, being that when this class is disposed it will emit a metric telemetry based on how long this context existed.
The main use for this context is timing how long certain events such as a function call or large block of code.

-	Create a Context from the Constructor:\
	It is somewhat unlikely that you will use this implementation but rather a child context in most scenarios.\
	```new TelemetryRequestObserverContext(<< Request Name >>, new List<ITelemetryLogger>() { << List of loggers >> }, << Parent Context >>, << Optional Source Name >>, << Optional Properties >>);```

	
-	Creating a Child Context of this type:\
	This util will copy all of the loggers and properties from the parent just as it did with the base telemetry context, but it will also properly initialize the constructor.
	```	
	context.CreateChildContext(
		TelemetryMetricObserverContext.BuildConstructor( 
			<< Metric Name >>,
			<< Optional Metric Namespace >> ),
			<< Optional Dictionary of Properties >>,
			<< Optional List of Loggers >> 
	));
	```

####TelemetryRequestObserverContext
This is an extension of the TelemetryContext class. This class adds one key features, being that when this class is disposed it will emit a request telemetry based on how long this context existed.
The main use for this context is timing how long API calls takes.

-	Create a Context from the Constructor:\
	It is somewhat unlikely that you will use this implementation but rather a child context in most scenarios.
	```	
	new TelemetryRequestObserverContext(
		<< Request Name >>,
		new List<ITelemetryLogger>() { << List of loggers >> },
		<< Parent Context >>,
		<< Optional Source Name >>,
		<< Optional Properties >> );
	```
	
-	Creating a Child Context of this type:\
	This util will copy all of the loggers and properties from the parent just as it did with the base telemetry context, but it will also properly initialize the constructor.
	```csharp	
	context.CreateChildContext(
		TelemetryRequestObserverContext.BuildConstructor(
			<< Request Name >>,
			<< Optional Source Name >>
		), << Optional Dictionary of Properties >>,
		<< Optional List of Loggers >> );
	```

###Telemetry Loggers
Telemetry Loggers are implemented using the ITelemetryLogger interface. This interface can be used to send telemetry to a variety of places. The only implementation that is currently included is a UTPLogger, but user implementations can be easily added.

####UTPLogger
This is the implementation of the ITelemetryLogger interface which sends telemetry to the Application Insights. The only requirement for initializing this logger is a Application Insights Key.

-	Initialize a UTP Logger:\
	This will initialize all of the required values inside of the UTPLogger and establish a connection to app insights and UTP.
	```new UTPLogger(<< Instrumentation Key>>)```


###Telemetry Manager
The Telemetry Manager is a method of managing Telemetry Context's in a project. This is a static class that works very similarly to Dependency injection. It is not required that you use this class to manage your Telemetry Contexts, but in scenarios where not using Dependency Injection it is by far the easiest way, as it manages context objects for the developer.

###Standard Workflow
-	Initialize
	-	Using Telemetry Manager:
	```	
	TelemetryManager.InitializeTelemetryManager(
		<< Build constructor of chosen context type >>,
		new List<ITelemetryLogger> { << List of Loggers >> },
		<< Service Name >>,
		<< Service Version >>;
	```
	-	Using Dependency Injection:\
		Chose which telemetry context type should be the base context and craete a singleton of that object in the dependency manager. One extra step that should be done is to set the Service Name and Service Version of this base context, but this is not required.

-	Emit Telemetry
	- 	Using Telemetry Manager:\
		Simply Call the TryEmitTelemetry function using a TelemetryMessage of the chosen telemetry type. This will automatically add all of the properties of the current context.\
		```TelemetryManager.TryEmitTelemetry( << TelemetryMessage >> );```
	-	Using Dependency Injection:\
		Collect a context from the dependecy manager then get the active context, and call the EmitTelemetry function


---
## My Workspace services

```MyWorkspace``` is built based on an event driven Microservices based architecture. 

***Defintions***

```Event```: Event is a single immutable source of truth that occurs whenever an entity or state changes in the system. Services and worker nodes communicate with each other through events. Events help us maintain eventual consistency in a complex distributed system that spans across various Geos and also provide the ability to always reconstruc```t the current state of the system by sourcing from the Messaging Hub.

```Microservices```: A complex distributed system of this nature needs to be refactored into multiple services and workers that should be scaled, maintained and deployed independently. Each such Microservice is a docker container image provisioned as a Kubelet in the Kubernetes cluster hosted on Azure. We chose AKS as the orchestration engine for running the cluster because of it’s cloud agnostic nature and it’s unopinionated implementation enables us to provide required customization to workaround any challenges that we face when deployed to variety of clouds.

```Security``` : All the interactions to any externally exposed resource are authenticated and authorized using Azure Active Directory and the communication happens over TLS 2.0 and above.


---
## AuthService
Auth Service API 1.0 

### Access 
```	
GET /api​/auth​/checkaccess
GET ​/api​/auth​/users​/{userID}​/checkaccess
GET /api​/auth​/constraints
GET /api​/auth​/users​/{userID}​/constraints
GET ​/api​/auth​/scopes
GET /api​/auth​/users​/{userID}​/scopes
```	

### RoleDefinition

```	
POST /api​/auth​/roledefinitions
PUT /api​/auth​/roledefinitions
GE ​/api​/auth​/roledefinitions
GET /api​/auth​/roledefinitions​/{id}
DELETE /api​/auth​/roledefinitions​/{id}
```	

### SegmentDefinition

```	
POST /api​/auth​/segmentdefinition
PUT /api​/auth​/segmentdefinition
GET /api​/auth​/segmentdefinition
GET /api​/auth​/segmentdefinition​/{id}
DELETE /api​/auth​/segmentdefinition​/{id}
```	

### UserRoleAssignment

```	
POST /api​/auth​/userroleassignment
PUT /api​/auth​/userroleassignment
GET /api​/auth​/userroleassignment
GET ​/api​/auth​/userroleassignment​/{userId}
DELETE /api​/auth​/userroleassignment​/{userId}
```	


## Catalog
---
### Agreements

```
POST /api​/catalog​/agreements
PUT /api​/catalog​/agreements
GET /api​/catalog​/agreements
GET ​/api​/catalog​/agreements​/{id}
DELETE /api​/catalog​/agreements​/{id}
```

### Azure
```
GET /api​/catalog​/Azure​/photo​/{id}
GET /api​/catalog​/Azure​/azureissuecount
GET /api​/catalog​/Azure​/permissions​/agreements​/{ID}
```

### DeploymentHub
```
POST /api​/catalog​/deploymenthub
DELETE /api​/catalog​/deploymenthub
```
### DeploymentRegion
```
POST /api​/catalog​/deploymentregion
DELETE /api​/catalog​/deploymentregion
```
### General
```
GET ​/api​/catalog​/general​/version
```

### Health
```
GET /api​/health​/readiness
GET /api​/health​/liveness
```

### HubNetworks

```
GET /api​/catalog​/hubnetworks
POST /api​/catalog​/hubnetworks
PUT /api​/catalog​/hubnetworks
GET ​/api​/catalog​/hubnetworks​/{id}
DELETE /api​/catalog​/hubnetworks​/{id}
```
### Machines

```
GET /api​/catalog​/machines
POST /api​/catalog​/machines
PUT /api​/catalog​/machines
GET /api​/catalog​/machines​/{id}
DELETE /api​/catalog​/machines​/{id}
```

### MachineSkus
```
GET /api​/catalog​/skus
POST /api​/catalog​/skus
PUT /api​/catalog​/skus
GET /api​/catalog​/skus​/{id}
DELETE /api​/catalog​/skus​/{id}
```
### Regions

```
GET /api​/catalog​/regions
POST /api​/catalog​/regions
PUT /api​/catalog​/regions
GET /api​/catalog​/regions​/{id}
DELETE /api​/catalog​/regions​/{id}
```

### Templates

```
GET /api​/catalog​/templates
POST /api​/catalog​/templates
PUT /api​/catalog​/templates
GET /api​/catalog​/templates​/{id}
DELETE /api​/catalog​/templates​/{id}
```
### UserAgreements
```
POST /api​/catalog​/users​/agreements​/{UserID}​/{AgreementID}
GET /api​/catalog​/users​/agreements​/{UserID}
DELETE /api​/catalog​/users​/agreements​/{UserID}
POST /api​/catalog​/users​/agreements​/{UserID}
```
### Users
```
GET /api​/catalog​/users​/{ID}
```

## Gateway
---
## Jobs
---
## ProvisioningEngine
---
## ResourceProvisioningService
---
### AzureDataDisk
```
GET /api​/resource​/azuredatadisk​/{id}
PUT /api​/resource​/azuredatadisk​/{id}
DELETE /api​/resource​/azuredatadisk​/{id}
GET /api​/resource​/azuredatadisk​/virtualmachine​/{virtualMachineID}
POST ​/api​/resource​/azuredatadisk
```
### AzureDNSZone
```
GET /api​/resource​/azurednszone​/{id}
PUT /api​/resource​/azurednszone​/{id}
POST
​/api​/resource​/azurednszone
```
### AzureNic
```
GET
​/api​/resource​/azurenic​/{id}
PUT
​/api​/resource​/azurenic​/{id}
DELETE
​/api​/resource​/azurenic​/{id}
GET
​/api​/resource​/azurenic​/virtualmachine​/{virtualMachineID}
POST
​/api​/resource​/azurenic
```
### AzureNsg
```
GET
​/api​/resource​/azurensg​/{id}
PUT
​/api​/resource​/azurensg​/{id}
DELETE
​/api​/resource​/azurensg​/{id}
GET
​/api​/resource​/azurensg​/workspace​/{workspaceID}
POST
​/api​/resource​/azurensg
```
###  AzurePublicAddress
```
GET
​/api​/resource​/azurepublicaddress​/{id}
PUT
​/api​/resource​/azurepublicaddress​/{id}
DELETE
​/api​/resource​/azurepublicaddress​/{id}
GET
​/api​/resource​/azurepublicaddress​/workspace​/{workspaceID}
POST
​/api​/resource​/azurepublicaddress
```
### AzureUdr
```
GET
​/api​/resource​/azureudr​/{id}
PUT
​/api​/resource​/azureudr​/{id}
DELETE
​/api​/resource​/azureudr​/{id}
GET
​/api​/resource​/azureudr​/workspace​/{workspaceID}
POST
​/api​/resource​/azureudr
```
### AzureVirtualMachine
```
GET
​/api​/resource​/azurevirtualmachine​/{id}
PUT
​/api​/resource​/azurevirtualmachine​/{id}
DELETE
​/api​/resource​/azurevirtualmachine​/{id}
GET
​/api​/resource​/azurevirtualmachine​/workspace​/{workspaceID}
GET
​/api​/resource​/azurevirtualmachine​/expiredpasswords​/{expiredDate}
POST
​/api​/resource​/azurevirtualmachine
```
### AzureVirtualMachineBase
```
GET
​/api​/resource​/azurevirtualmachinebase​/{id}
GET
​/api​/resource​/azurevirtualmachinebase​/workspace​/{workspaceID}
GET
​/api​/resource​/azurevirtualmachinebase​/expiredpasswords​/{expiredDate}
```
### AzureVirtualMachineGeneralized
```
GET
​/api​/resource​/azurevirtualmachinegeneralized​/{id}
PUT
​/api​/resource​/azurevirtualmachinegeneralized​/{id}
DELETE
​/api​/resource​/azurevirtualmachinegeneralized​/{id}
GET
​/api​/resource​/azurevirtualmachinegeneralized​/workspace​/{workspaceID}
GET
​/api​/resource​/azurevirtualmachinegeneralized​/expiredpasswords​/{expiredDate}
POST
​/api​/resource​/azurevirtualmachinegeneralized
```
### AzureVirtualNetwork
```
GET
​/api​/resource​/azurevirtualnetwork​/{id}
PUT
​/api​/resource​/azurevirtualnetwork​/{id}
DELETE
​/api​/resource​/azurevirtualnetwork​/{id}
GET
​/api​/resource​/azurevirtualnetwork​/workspace​/{workspaceID}
POST
​/api​/resource​/azurevirtualnetwork
```
### AzureWorkspace
```
GET
​/api​/resource​/azureworkspace​/{id}
PUT
​/api​/resource​/azureworkspace​/{id}
DELETE
​/api​/resource​/azureworkspace​/{id}
GET
​/api​/resource​/azureworkspace​/{id}​/regionid
GET
​/api​/resource​/azureworkspace​/owner​/{ownerID}
GET
​/api​/resource​/azureworkspace
POST
​/api​/resource​/azureworkspace
GET
​/api​/resource​/azureworkspace​/running
GET
​/api​/resource​/azureworkspace​/expiredlifespan​/{expiredDate}
GET
​/api​/resource​/azureworkspace​/userids
GET
​/api​/resource​/azureworkspace​/natruleinfo​/{id}
```
### Health
```
GET
​/api​/health​/readiness
GET
​/api​/health​/liveness
```
### NatRule
```
GET
​/api​/resource​/natrule​/{id}
PUT
​/api​/resource​/natrule​/{id}
DELETE
​/api​/resource​/natrule​/{id}
GET
​/api​/resource​/natrule​/workspace​/{workspaceID}
GET
​/api​/resource​/natrule​/machine​/{machineID}
POST
​/api​/resource​/natrule
```

## Schema
AzureWorkspaceDto
```
{
ID	string($uuid)
Name	string
nullable: true
InternalName	string
nullable: true
Description	string
nullable: true
Created	string($date-time)
nullable: true
Deployed	string($date-time)
nullable: true
Updated	string($date-time)
nullable: true
State	ResourceStatestring
Enum:
Array [ 10 ]
OwnerID	string($uuid)
TemplateID	string($uuid)
nullable: true
SharedOwnerIDs	[...]
VirtualMachines	[...]
VirtualMachinesGeneralized	[...]
VirtualNetworks	[...]
Nsg	AzureNsgDto{...}
Udr	AzureUdrDto{...}
HubNetworkInfo	HubNetworkInfo{...}
ParentTaskID	string($uuid)
AzureTags	{...}
nullable: true
PublicAddresses	[...]
DNSZone	AzureDNSZone{...}
SubscriptionID	string($uuid)
RegionID	string($uuid)
ResourceGroupName	string
nullable: true
Location	string
nullable: true
SecurityLock	boolean
}
```

AzureWorkspaceWithoutSerializedChildren
```{
ID*	string($uuid)
minLength: 1
Name*	string
maxLength: 100
InternalName	string
nullable: true
Description	string
maxLength: 1000
nullable: true
Created	string($date-time)
nullable: true
Deployed	string($date-time)
nullable: true
Updated	string($date-time)
nullable: true
State*	ResourceStatestring
Enum:
Array [ 10 ]
OwnerID*	string($uuid)
minLength: 1
TemplateID	string($uuid)
nullable: true
SharedOwnerIDs	[...]
HubNetworkInfo	HubNetworkInfo{...}
ParentTaskID	string($uuid)
AzureTags*	{...}
SubscriptionID	string($uuid)
RegionID	string($uuid)
ResourceGroupName	string
nullable: true
Location	string
nullable: true
SecurityLock	boolean
}
```


## TaskManagementService
---
## License

---
## Privacy


