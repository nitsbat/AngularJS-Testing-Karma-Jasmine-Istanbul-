
var testingAngularApp = angular.module('testingAngularApp',[]);

testingAngularApp.controller('mainController', function($rootScope,$scope,$http,$timeout){

    $scope.title = "Testing Angular Test";
    $scope.API_KEY = '654666003665c6669a17bc2c4177e144';
    
    $scope.destinations = [];
    $scope.newDestination = {
        city : undefined,
        country : undefined
    };

    $scope.addDestination = function(){
        $scope.destinations.push({
            city : $scope.newDestination.city,
            country : $scope.newDestination.country
        })
    };

    $scope.toFarenheit = function(deg){
        return Math.round((1.8 * (deg - 273)) + 32 );
    }

    $scope.removeDestination = function(index){
        $scope.destinations.splice(index,1);
    }

    $scope.getWeather = function(destination){
        $http.get("http://api.openweathermap.org/data/2.5/weather?q=" +destination.city+"&appid="+$scope.API_KEY).then(
            function successCallback(response){
                if(response.data.weather){
                    destination.weather = {};
                    destination.weather.main = response.data.weather[0].main;
                    destination.weather.temp = $scope.toFarenheit(response.data.main.temp);
                    console.log(response.data.main.temp);
                }else{
                    $scope.message = "City Not Found";
                }
            },
            function errorCallback(error){
                $scope.message = "Server Error";
            }
        )
    };

    $scope.messageWatcher = $scope.$watch('message',function(){
        if($scope.message){
            $timeout(function (){
                $scope.message = null;
            },3000);
        }
    });


});


testingAngularApp.filter('warmestDest',function(){
    return function(destinations,minTemp){
        var warmDest = [];

        angular.forEach(destinations,function(destination){
            if(destination.weather && destination.weather.temp && destination.weather.temp >= minTemp){
                warmDest.push(destination);
            }
        });
        return warmDest;
    }
});