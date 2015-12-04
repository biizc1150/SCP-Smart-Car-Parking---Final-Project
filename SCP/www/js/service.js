angular.module('starter.services', [])

.factory('Floor', function() {
    var self = this;
    var floor_list = [{
        title: '1st Floor',
        available: 3,
        id: 1,
        color: 'green'
    }, {
        title: '2nd Floor',
        available: 0,
        id: 2,
        color: 'red'
    }, {
        title: '3nd Floor',
        available: 0,
        id: 3,
        color: 'red'
    }];

    self.all = function() {
        return floor_list;
    }

    self.add = function(newObj) {
        floor_list[floor_list.length] = newObj;
    }

    self.get = function(floorID) {
        for(var i = 0; i < floor_list.length; i++){
        	if(floor_list[i].id == floorID){
        		return floor_list[i];
        	}
        }
        return;
    }

    self.remove = function(floor) {
        floor_list.splice(floor_list.indexOf(floor), 1);
    }

    self.getSize = function() {
        return floor_list.length;
    }

    return self;
})

// Price Localization and Recognition from Price Tag Snapshot.

.factory('Car',function(){
    var self = this;
    var car_list = [];

    self.add = function(licen,mo,stime,etime,c){
        car_list[car_list.length] = {
            license: licen,
            model: mo,
            start_time: stime,
            class: c
        };
    }

    self.all = function(){
        return car_list;
    }

    self.activeClass = function(index){
        for(var i = 0; i < car_list.length; i++){
            if(i != index){
                car_list[i].class = '';
            }else{
              car_list[i].class = 'ion-ios-checkmark-outline';  
            }
        }
    }

    self.unActiveClass = function(index){
        for(var i = 0; i < car_list.length; i++){
            if(i == index){
                car_list[i].class = '';
                return;
            }
        }
    }

    self.Remove = function(licen){
        for(var i = 0; i < car_list.length; i++){
            if(car_list[i].license == licen){
                car_list.splice(i,1);
                // return;
            }
        }
        // car_list.splice(car_list.indexOf(licen),1);
    }

    self.Clear = function(){
        car_list = [];
    }

    return self;
})

.factory('socket',function(socketFactory){
    return socketFactory({
        prefix: 'foo~',
        ioSocket: io.connect('https://socket.jumpwire.io')
    });
})