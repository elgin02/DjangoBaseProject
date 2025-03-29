
$(document).ready(function() {

    let typingTimer;
    let doneTypingInterval = 1000;
// When the username field changes, fetch zip codes and temperatures
    $("#username").on("input", function () {
        clearTimeout(typingTimer); // Clears timeout whenever user starts typing
        let username = $(this).val().trim();

        if (username) {
            typingTimer = setTimeout(() => {
                //console.log(username)
                $.post(
                    "/user/",
                    {username: username},
                    updateTable
                )

            }, doneTypingInterval);
        } else {
            $("#table").empty(); // Clear the table if no username
        }
    });

    function fetchTemperature(url, zipcode, callback) {
        $.get(url, (element) => {
            //console.log(element);
            //element = JSON.stringify(element);
            var temperature = element.list[0].main.temp;
            //var zipcode = zipcode;
            //console.log(temperature);

            if (element.cod == 200) {
                callback(temperature, zipcode);  // Pass the temperature to the callback
            } else {
                callback(null);  // Pass null to indicate failure
            }
        }).fail(function (jqXHR) {
           // alert("Invalid zipcode.");
            callback(null);  // Pass null if the request fails
        });
    }

    function updateTable(datas) {
        //console.log(datas)
        var api_key = '2b39e4a76fb50e265c399bcc58dca6ea';
        $("#user").html("<tr><th>ZIP</th><th>Temp</th></tr>");
        for (let data of datas) {
            var zipcode = data['zip_code'];
            //console.log(zipcode)
            var url = `https://api.openweathermap.org/data/2.5/forecast?zip=${zipcode}&appid=${api_key}&units=imperial`;
            var row = '';
            var temp = 0;
            fetchTemperature(url, zipcode, function (fetchedTemp, fetchedZipcode) {
                //zipcode = data['zip_code'];
                //console.log(fetchedTemp, fetchedZipcode);
                temp = fetchedTemp;
                if (fetchedTemp == null) {
                    $("#user").empty();
                    return;
                }
                row = "<tr><td>" + fetchedZipcode + "</td><td>" + fetchedTemp + "</td></tr>";
                $("#user").append(row);
            });
        }
    }

    $("#submit").click(function() {
        let username = $("#username").val();
        let zipcode = $("#zipcode").val();

        // Check zipcode validity through $.get()
        var api_key = '2b39e4a76fb50e265c399bcc58dca6ea';
        var url = `https://api.openweathermap.org/data/2.5/forecast?zip=${zipcode}&appid=${api_key}&units=imperial`;
        $.get(url, (element) => {
            console.log(element);
           if (element.cod != 404 && username && zipcode) {
            $.post(
                "/add_zip/",
                { username : username, zipcode : zipcode },
                updateTable
            )
            }
        }).fail(function (jqXHR) {
            alert("Please type in a name.");
            //callback(null);  // Pass null if the request fails
        });
    });

    setTimeout(function() {
        let username = $("#username").val().trim();
        if (username) {
            $.post(
                "/user/",
                {username: username},
                updateTable
            );
        }
    }, 30000);
});