
describe('Testing AngularJS Test Suite',function(){

    beforeEach(module('testingAngularApp'));

    describe('Testing AngularJS Controller',function(){
        var scope , ctrl , httpBackend,timeout;

        beforeEach(inject(function($controller,$rootScope, $httpBackend , $timeout){
                scope = $rootScope.$new();
                ctrl = $controller('mainController', {$scope:scope});
                httpBackend = $httpBackend;
                timeout = $timeout;
                rootScope = $rootScope;
        }));
        
        afterEach(function(){
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should initialize the title in the scope',function(){
            expect(scope.title).toBeDefined();
            expect(scope.title).toBe("Testing Angular Test");
        });

        it('should add 2 destinations to the destination list' ,function(){
            expect(scope.destinations).toBeDefined();
            expect(scope.destinations.length).toBe(0);

            scope.newDestination = {
                city : "Roorkee",
                country : "India"
            };

            scope.addDestination();

            expect(scope.destinations.length).toBe(1);
            expect(scope.destinations[0].city).toBe('Roorkee');
            expect(scope.destinations[0].country).toBe('India');

            scope.newDestination.city = "London";
            scope.newDestination.country = "England";

            scope.addDestination();

            expect(scope.destinations.length).toBe(2);
            expect(scope.destinations[1].city).toBe('London');
            expect(scope.destinations[1].country).toBe('England');


        });

        it('should remove a destination from the destination list',function(){

            scope.destinations = [
                {
                    city : "Paris",
                    country : "France"
                },
                {
                    city : "London",
                    country : "England"
                }
            ];
            expect(scope.destinations.length).toBe(2);

            scope.removeDestination(0);
            expect(scope.destinations.length).toBe(1);
            expect(scope.destinations[0].city).toBe("London");
            expect(scope.destinations[0].country).toBe("England");
        });

        it('should update the weather for a specific destination', function() {
            scope.destination =
            {
              city : "Paris",
              country: "France"
            };
      
            httpBackend.expectGET("http://api.openweathermap.org/data/2.5/weather?q="+ scope.destination.city +"&appid=" + scope.API_KEY).respond(
              {
                weather: [{main : 'Clouds'}],
                main : { temp : 293.65 }
              }
            );
      
            scope.getWeather(scope.destination);
      
            httpBackend.flush();
      
            expect(scope.destination.weather.main).toBe('Clouds');
            expect(scope.destination.weather.temp).toBe(69);
          });

        it('should remove error after a specified time',function(){
            scope.message = "Error" ;
            expect(scope.message).toBe("Error");

            scope.$apply(); // This is used for applying the changes and actually implement the Function.
            timeout.flush();

            expect(scope.message).toBeNull();
        });

        
        it('should add a message if no city is found', function() {
            scope.destination =
            {
              city : "Paris",
              country: "France"
            };
      
            httpBackend.expectGET("http://api.openweathermap.org/data/2.5/weather?q="+ scope.destination.city +"&appid=" + scope.API_KEY).respond(
              {}
            );
      
            scope.getWeather(scope.destination);
      
            httpBackend.flush();
      
            expect(scope.message).toBe('City Not Found');
          });

          
        it('should add a message when there is a server error', function() {
            scope.destination =
            {
              city : "Paris",
              country: "France"
            };
      
            httpBackend.expectGET("http://api.openweathermap.org/data/2.5/weather?q="+ scope.destination.city +"&appid=" + scope.API_KEY).respond(500);
      
            scope.getWeather(scope.destination);
            httpBackend.flush();
      
            expect(scope.message).toBe("Server Error");
          });

    });

    describe('Testing AngularJS Filter',function(){
        it('should return warm destinations',inject(function($filter){
            var warmest = $filter('warmestDest');

            var destinations = [
                {
                    city : "Beijing",
                    country : "China",
                    weather : {
                        temp : 21
                    }
                },
                {
                    city : "Moscow",
                    country : "Russia",
                    weather : {
                        temp : 12
                    }
                },
                {
                    city : "Lima",
                    country : "Peru",
                    weather : {
                        temp : 15
                    }
                }
            ] ;

            expect(destinations.length).toBe(3);

            var warmDestinations = warmest(destinations,15);

            expect(warmDestinations.length).toBe(2);
            expect(warmDestinations[0].city).toBe("Beijing");
            expect(warmDestinations[1].city).toBe("Lima");
        }));
    })

}); // it is used to declare a test .

