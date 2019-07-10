$(document).ready(() => {
    $(function () {
        $(".datepicker").datepicker({
            dateFormat: 'dd/mm/yy'
        });
    });

    airports = [{
        airport: "DME",
        city: "moscow"
    }, {
        airport: "LGW",
        city: "london"
    }, {
        airport: "CDG",
        city: "paris"
    }, {
        airport: "SKP",
        city: "skopje"
    }, {
        airport: "FCO",
        city: "rome"
    }, {
        airport: "MAD",
        city: "madrid"
    }, {
        airport: "BCN",
        city: "barcelona"
    }, {
        airport: "FRA",
        city: "frankfurt"
    }, {
        airport: "DXB",
        city: "dubai"
    }]

    let responseDataStored;
    let radioButtonsValue;
    let flightsSearchBtn = $("#flights-search-btn");
    let flightsFrom = $("#flights-from");
    let flightsTo = $("#flights-to");
    let flightsDateFrom = $("#flights-date-from");
    let flightsDateTo = $("#flights-date-to");
    let flightsLoadingAnimation = $("#flights-animation-loading").append(`<img src="https://www.drupal.org/files/issues/throbber_12.gif" alt="" width="100px" height="auto">`);
    let filterCardsBtn = $("#filter-btn-cards");
    let filterDiv = $("#filter-div");
    let supFooter = $("#sup-footer");
    let footer = $("#footer");
    let adTwo = $("#ad-space-two");

    let flightsCardsPages = $("#flights-cards-pages");
    let flightsCardsContent = $("#flights-cards-content");
    let popularDestination = $("#popular-destination");

    let slider = document.getElementById("myRange");
    let output = document.getElementById("demo");
    let itemPerPage = 15;
    let pages = [
        []
    ];
    let count = 0;

    //hiding animations
    flightsLoadingAnimation.hide();
    adTwo.hide();
    filterDiv.hide();
    supFooter.hide();

    flightsSearchBtn.on("click", () => {
        adTwo.hide();
        filterDiv.hide();
        footer.hide();
        supFooter.hide();
        flightsCardsPages.children().remove();

        flightsLoadingAnimation.show();

        //Changening city names to airports codes
        let flightsFromReplacing = flightsFrom.val().replace(/ /g, "-");
        let flightsToReplacing = flightsTo.val().replace(/ /g, "-");

        for (let i = 0; i < airports.length; i++) {
            if (flightsFromReplacing == airports[i].city) {
                x = airports[i].airport;
            }
            if (flightsToReplacing == airports[i].city) {
                y = airports[i].airport;
            }
        }

        Method.printPopularDestinationCards(flightsToReplacing, "../mockData/DB.json");
        Method.ajaxCall(`https://api.skypicker.com/flights?flyFrom=${x}&to=${y}&dateFrom=${flightsDateFrom.val()}&dateTo=${flightsDateTo.val()}&sort=price&curr=USD&partner=picky`, Method.processingData, Method.printingItemPerPage, Method.setPricesOnSlider);

        filterCardsBtn.on("click", () => {
            flightsLoadingAnimation.show();
            flightsCardsContent.children().remove();
            radioButtonsValue = $("input[name='exampleRadios']:checked").val();
            Method.filterData(responseDataStored);
        });
    })

    let Method = {
        //#region Dario Kostov
        convertTime: (time) => {
            var date = new Date(time * 1000);
            var hours = date.getHours();
            var minutes = "0" + date.getMinutes();
            var day = "0" + date.getDate();
            var month = date.getMonth() + 1;
            return day.substr(-2) + "/" + month + " " + hours + 'h' + minutes.substr(-2) + "m";
        },
        
        processingData: (flightsData) => {
            pages = [[]];
            count = 0;
            flightsCardsContent.children().remove();
            footer.show();
            filterDiv.show();
            adTwo.show();
            flightsLoadingAnimation.hide();

            if (flightsData.length >= 1) {
                for (let element of flightsData) {
                    let cardsFlightsPrint = `
                        <div class="card" id="cardMainDiv">
                            <h5 class="card-header">${element.cityFrom}
                                <span> <img src="http://www.transparentpng.com/thumb/airplane/airplane-free-download-5.png" width="25px">
                                </span>
                                ${element.cityTo}
                            </h5>
                            <div class="row" id="cardContent">
                                <div class="col-5">
                                    <p>
                                        Departure: ${Method.convertTime(element.dTime)}
                                    </p>
                                    <p>
                                        Arrival: ${Method.convertTime(element.aTime)}
                                    </p>
                                    <p>
                                        Fly Duration: ${element.fly_duration}
                                    </p>
                                </div>
                                <div class="col-5">
                                    <p>
                                        ${element.route.length > 1 ? `Stops: ${element.route.length}` : "Direct"}
                                    </p>

                                    <p id="cardContentScroll">
                                        Route:${element.route.map(el => `<br>
                                        <img src="https://images.kiwi.com/airlines/64/${el.airline}.png" width="20px">
                                        ${el.cityFrom}
                                        <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                        ${el.cityTo}`)}
                                    </p>
                                </div>
                                <div class="col-2" id="cardContentPrice">
                                    <p>
                                        ${element.conversion.EUR}\u20AC / $${element.conversion.USD}
                                    </p>
                                    <a href="${element.deep_link}" class="btn btn-primary" target="_blank">
                                        Select
                                    </a>
                                </div>
                            </div>
                        </div>`;
                    if (count < itemPerPage) {
                        pages[pages.length - 1].push(cardsFlightsPrint);
                        count++;
                    } else {
                        pages.push([])
                        pages[pages.length - 1].push(cardsFlightsPrint);
                        count = 1;
                    };
                };
            } else {
                let noCards = `<h1>No Tickets Available!</h1>`
                flightsCardsContent.append(noCards);
            }
        },
        
        setPricesOnSlider: (data) => {
            slider.setAttribute("min", data[0].conversion.USD);
            slider.setAttribute("max", data[data.length - 1].conversion.USD);
            slider.setAttribute("value", data[data.length - 1].conversion.USD);
            output.innerHTML = slider.value;
            slider.oninput = function () {
                output.innerHTML = this.value;
            };
        },

        //#endregion
        
        //#region Martin Petrovski
        ajaxCall: (url, callback, callback2, callback3) => {
            $.ajax({
                url: url,
                success: function (response) {
                    console.log(response);
                    responseDataStored = response.data;
                    callback(responseDataStored);
                    callback2(pages);
                    callback3(responseDataStored);
                },
                error: function (response) {
                    console.log(response.status);
                    console.log(response);
                }
            });
        },

        printingItemPerPage: (list) => {
            $("#pagination-buttons").children().remove();
            list[0].forEach(el => {
                flightsCardsContent.append(el);
            });

            let buttons = `
            <div class="col-3"></div>
            <div class="col-9">
              <nav aria-label="Page navigation example" id="div-pagination-buttons">
                <ul class="pagination" id="pagination-buttons">
      
                </ul>
              </nav>
            </div>`;
            flightsCardsPages.append(buttons);

            for (i = 0; i < list.length; i++) {
                $("#pagination-buttons").append(`<li class="page-item"><a class="page-link" href="#" value="${i}">${i + 1}</a></li>`);
            };

            $(".page-link").on("click", (e) => {
                flightsCardsContent.children().remove();
                let buttonClicked = e.target.getAttribute("value");
                list[buttonClicked].forEach(el => {
                    flightsCardsContent.append(el);
                });
            });

            Method.setFooter(`../mockData/DB.json`);
        },

        filterData: (data) => {
            setTimeout(function () {
                flightsLoadingAnimation.hide();
                let filteredData = data.filter(d => d.route.length < radioButtonsValue && d.conversion.USD <= output.innerText);
                Method.processingData(filteredData);
                Method.printingItemPerPage(pages);
            }, 2000);
        },
        //#endregion

        //#region Goran Todorovski
        printPopularDestinationCards: (cityName, url) => {
            $.ajax({
                url: url,
                success: function (response) {
                    popularDestination.children().remove();
                    let card;
                    console.log(response.Array);
                    for (let city of response.Array) {
                        if (city.id == cityName) {
                            card = `<div class="card" id="testCard" style="width: 18rem;">
                        <img src="${city.img}" class="card-img-top" alt="...">
                        <div class="card-body">
                          <h5 class="card-title">${city.title}</h5>
                          <p class="card-text" style="font-size: 12px">${city.description}</p>
                          <a href="${city.deepLink}" class="btn btn-primary" target="_blank">Read more</a>
                        </div>
                      </div><br>`
                            popularDestination.append(card);
                        }
                    }
                },
                error: function (response) {
                    console.log(response.status);
                    console.log(response);
                }
            });
        },
        
        setFooter: (data) => {
            $.ajax({
                url: data,
                success: function (response) {
                    footer.children().remove();
                    let logo;
                    let randomNumber;
                    console.log(response.Partners);
                    let arrayNum = [];
                    var count = 5;
                    for (let i = 0; i < count; i++) {
                        randomNumber = Math.floor(Math.random() * 10)
                        if (!arrayNum.includes(randomNumber)) {
                            arrayNum.push(randomNumber);
                            console.log(randomNumber)
                        } else {
                            count++;
                        }
                    }
                    footer.append(`<h1 style="color: white">Our Partners</h1>`)
                    for (const number of arrayNum) {
                        logo = `<a href="${response.Partners[number].deepLink}" target="_blank"><img src="${response.Partners[number].img}" width="150px"></a>`
                        footer.append(logo);
                    }
                    supFooter.show();
                },
                error: function (response) {
                    console.log(response.status);
                    console.log(response);
                }
            })
        }

        //#endregion
    };
})