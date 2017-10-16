Para poder liberar hay que seguir los siguientes pasos:
*  Realizar merge de los branches que se desean liberar. Esto sepuede realizar con un merge request dentro de gitlab o desde la linea de comandos (dentro del branch master):

> git merge --no-ff branch-a-liberar

 Una vez que se realiza el merge es necesario borrar el branch.

*  Actualizar el archivo **./app/appSettings.js** para que se apunte a las apis de producción. ejemplo: 

``` appSettings.js
angular.module('marketplace')
 
  .run(function ($rootScope, $location, $anchorScroll, $routeParams) {
    $rootScope.rsTitle = 'click suscribe | CompuSoluciones';
    $rootScope.rsVersion = '2.1.1';
    /* $rootScope.API = 'http://localhost:8080/';
    $rootScope.MAPI = 'http://localhost:8083/';
    $rootScope.dominio = 'localhost'; */
    $rootScope.API = 'https://pruebas.compusoluciones.com/';
    $rootScope.MAPI = 'http://microsoft-api.us-east-1.elasticbeanstalk.com/';
    $rootScope.dominio = 'clicksuscribe';
  });
```

*  En caso de que se agregara algo al index.html, se tiene que copiar y pegar dentro de **./marketplace-app-min/index.html**, despues es necesario comentar todos los scripts de controllers y services, y descomentar el siguiente script:

``` script
<script type="text/javascript" src="app/all.js"></script>
```

*  Tambien es necesario asegurarse que el script de pago con tarjeta sea el de producción:

``` tarjeta
<script src="https://gateway-na.americanexpress.com/checkout/version/33/checkout.js" 
            data-error="errorCallback"
            data-complete="completeCallback"
            data-cancel="cancelCallback" >
    </script>
```

*  Es necesario comprimir el código html se utiliza:

> gulp html

 Para el código javascript se utiliza

> gulp compress

 Esto actualiza la carpeta de **./marketplace-app-min/app**

*  Es necesario actualizar el archivo **./marketplace-app-min/manifest.appcache** cambiando la versión y la fecha de actualización.

*  En la consola de amazon cs-ti, contiene dos buckets en s3 que deben ser actualizados, el primero es **clicksuscribe.com**, aqui se suben todos los archivos de **./marketplace-app-min** **excepto** la carpeta de **Anexos**, una vez que ya se subieron los archivos es necesario seleccionar todos los elementos y en la opción **More** seleccionar **Make Public**, se realiza el mismo procedimiento en el bucket **marketplace.compusoluciones.com**.

*  Para que sean reflejados los cambios del código, es necesario invalidar los archivos, esto se realiza en la misma consola de amazon cs-ti en el servicio **CloudFront**, para esto hay que hacer click en el ID de las distribuiciones que tengan en su **Origin** marketplace.compusoluciones.com.s3.am, pruebas1.compusoluciones.com, clicksuscribe1.compusoluciones.com, clicksuscribe.com.s3.amazonaws.com. 

 * Dentro de cada distribución, hay que seleccionar la pestaña **Invalidations** y seleccionar el     botón **Create Invalidation** dentro de la caja de texto hay que ingresar:

>  /*

y precionar el botón **Invalidate**.

