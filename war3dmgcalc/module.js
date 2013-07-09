var w3dc = angular.module('War3DmgCalc', []);

w3dc.config(function($routeProvider)
{
    $routeProvider
    .when('/',
    {
        controller:  'RootCtrl',
        templateUrl: 'war3dmgcalc/controllers/root/materials/views/root.ej',
    })
    .otherwise({ redirectTo: '/' })
    ;
});

$(document).ready(function()
{
    'use strict';
//    console.log('this is the shit =)');
    
    $(function()
    {
        $( document ).tooltip
        ({ 
            track: true,
            show: false,
            hide: false,
        });
    });
});


