// google_maps.js -> controller for google maps

define([],
    function () {


        return {
            GetGeoCoordinates: getGeoCoordinates,       // get Google coordinates in format (latitude, longitude)
            GetSplittedCoord: getSplittedCoord          // get the Int and Dec parts from a value
        }




        // function: getGeoCoordinates -> get Google coordinates in format (latitude, longitude).
        // param: address -> input string for Google API (syntax: <address>-<city>).
        // param: onResult -> callback function on Google API success.
        // param: onFail -> callback function on Google API error.
        // return value -> none (but Google request done).
        function getGeoCoordinates(address, onResult, onFail) {

            if (address == "") return $();
            var geocoder = new window.google.maps.Geocoder();

            return $(geocoder.geocode({ 'address': address }, function (results, status) {

                if (status == window.google.maps.GeocoderStatus.OK) {
                    var latitude = results[0].geometry.location.lat();
                    var longitude = results[0].geometry.location.lng();
                    var result = { "latitude": latitude, "longitude": longitude };
                    onResult(result);
                } else {
                    onFail(status);
                }
            }));
        }
        // function: getSplittedCoord -> get the Int and Dec parts from a value.
        // param: value -> float value.
        // return value -> Int : integer part of Value.
        // return value -> Dec : decimal part of Value.
        function getSplittedCoord(value) {
            var result = {
                Int: 0,
                Dec: 0
            }

            var int_part = Math.floor(value);
            var dec_part = value - int_part;
            dec_part = Math.floor(dec_part * 100000);

            result.Int = int_part;
            result.Dec = dec_part;

            return result;
        }

    });