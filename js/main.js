var map;
    var layer_ = [];
    //1FqGIwoYhlY7rLHE8-Nu4fRwQF6gslPKsl8C_6sh-
    var tableId = ['1lqsAhcETs5M8sY-GF7tYWdq-xLZ_x68iIUDeXIoA', '1PPpjBqOmjtpbGWz-3nZ6RHdNzAQ-rjHYi663OoOL', '1VMKy6uAM3PTT9UhSZQTTBVzZxaEfLp5g6nyy2h6j', '1zw0L4HbIz_dNFko8hxn5fUISMTfY3SbLiQzYlkkr'];

    // 1lqsAhcETs5M8sY-GF7tYWdq-xLZ_x68iIUDeXIoA (2010),'1MYUia1wz4XNWpDQCtXv578RFD2_lstUSP4rGsnTp (2014)
    // tableId0 = 六都2010各里圖層(ALL); tableId1 = 六都2010各里圖層(filter); tabeleId2 = 六都鄉鎮區圖層 ; tableId3 = 六都縣市圖層
    var infowindow = new google.maps.InfoWindow();
    //var mapLabel = new MapLabel();
    function loadMap(myLatLng) {
        for (var i = 0; i < tableId.length; i++) {
            layer_[i] = new google.maps.FusionTablesLayer({
                query: {
                    select: "geometry",
                    from: tableId[i]
                },
                suppressInfoWindows: true,
                map: map,
                styleId: 2,
                templateId: 2
            });
            if (i == 0) {
                layer_[0].styleId = 3;
                layer_[0].templateId = 3;
            }
            layer_[i].setMap(map);
            //console.log(layer_[i]);
        }
        //map.setCenter(myLatLng);
        //map.setZoom(10);
    }

    function initialize() {
        var myLatLng = new google.maps.LatLng(24.97592870964595, 121.48632444044824);
        map = new google.maps.Map(document.getElementById('map_canvas'), {
            center: myLatLng,
            zoom: 10,
            panControl: false,
            scaleControl: false,
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.LARGE,
                position: google.maps.ControlPosition.TOP_LEFT
            },
            mapTypeControl: false
        });
        map.controls[google.maps.ControlPosition.RIGHT_TOP].push(document.getElementById('slider-bar'));
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('googft-legend-open'));
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('googft-legend'));

        var style = [{
            featureType: 'all',
            elementType: 'all',
            stylers: [{
                "saturation": -75
            }, {
                "gamma": 1.87
            }, {
                "visibility": "simplified"
            }, {
                "weight": 0.6
            }]
        }];
        var styledMapType = new google.maps.StyledMapType(style, {
            map: map,
            name: 'Styled Map'
        });
        map.mapTypes.set('map-style', styledMapType);
        map.setMapTypeId('map-style');
        // Replace the xxx with your Fusion Tables IDs.
        //You can use FT Wizard http://fusion-tables-api-samples.googlecode.com/svn/trunk/FusionTablesLayerWizard/src/index.html
        loadMap(myLatLng);


        //用迴圈畫三層地圖
        
        for (var i = 0; i < 2; i++) {
            google.maps.event.addListener(layer_[i], 'click', function(e) {
                //console.log(e);
                votes = [Number(e.row['DPP'].value), Number(e.row['KMT'].value), Number(e.row['OTR'].value)];
                rates = [Number((e.row['DPP'].value / e.row['Votes'].value * 100).toFixed(2)), Number((e.row['KMT'].value / e.row['Votes'].value * 100).toFixed(2)), Number((e.row['OTR'].value / e.row['Votes'].value * 100).toFixed(2))]
                dpp = votes[0], dpp2 = rates[0];
                kmt = votes[1], kmt2 = rates[1];
                otr = votes[2], otr2 = rates[2];
                $(function() {
                    Highcharts.setOptions({
                        colors: ['#00C800', '#0000FF', '#ADADAD']
                    });
                    $('#container').highcharts({
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: e.row['Villige_NAME'].value + "候選人得票數"
                        },
                        xAxis: {
                            categories: [
                                tableidselections + '年藍綠得票比較'
                            ],
                            crosshair: true
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: '得票數 (票)'
                            }
                        },
                        tooltip: {
                            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                '<td style="padding:0"><b>{point.y:.0f} 票</b></td></tr>',
                            footerFormat: '</table>',
                            shared: true,
                            useHTML: true
                        },
                        plotOptions: {
                            column: {
                                pointPadding: 0.2,
                                borderWidth: 0
                            }
                        },
                        series: [{
                            name: '綠營',
                            data: [dpp]
                        }, {
                            name: '藍營',
                            data: [kmt]
                        }, {
                            name: '其他陣營',
                            data: [otr]
                        }]
                    });
                    $('#container2').highcharts({
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'pie'
                        },
                        title: {
                            text: e.row['Villige_NAME'].value + "得票率分佈"
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    format: '<b>{point.name}</b>: {point.percentage:.2f} %',
                                    style: {
                                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                    }
                                }
                            }
                        },
                        series: [{
                            name: "政黨陣營",
                            colorByPoint: true,
                            data: [{
                                name: '綠營',
                                y: dpp2,
                                sliced: true,
                                selected: true
                            }, {
                                name: '藍營',
                                y: kmt2
                            }, {
                                name: '其他陣營',
                                y: otr2
                            }]
                        }]
                    });
                });
                //if (infowindow) infowindow.close();
                document.getElementById("year").innerHTML = '<h3>' + tableidselections + '年選舉結果</h3>';
                document.getElementById("table").innerHTML = 
                    '<table class="tg" align="center" style="width:280px;">' +
                    '<tr>' +
                    '<th class="tg-i8ik" colspan="3">' + e.row['County_NAME'].value + '</th>' +
                    '</tr>' +
                    '<tr>' +
                    '<td class="tg-hgcj">區里名：</td>' +
                    '<td class="tg-s6z2" id="villige" colspan="2">' + e.row['Villige_NAME'].value + '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td class="tg-hgcj">' + tableidselections + '選舉人數：</td>' +
                    '<td class="tg-s6z2" colspan="2">' + e.row['People'].value + '人</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td class="tg-hgcj">投票率：</td>' +
                    '<td class="tg-s6z2" style="font-weight:bold; font-size:16px;">' + (e.row['Votes'].value / e.row['People'].value * 100).toFixed(2) + '%' + '</td>' +
                    '</tr>' +
                    '</table>';

                map.setCenter(e.latLng);
            });

        };

        //點擊infowindow的內容用迴圈來跑

        tableidselections = 2010;


        infowindow = new google.maps.InfoWindow();

        var CountyCheck = ['TPE', 'XBE', 'TAO', 'TCH', 'TNA', 'KSH'];
        for (var i = 0; i < CountyCheck.length; i++) {
            google.maps.event.addDomListener(document.getElementById(CountyCheck[i]),
                'click',
                function() {
                    if (infowindow) infowindow.close();
                    //ClearJson(mapLabel);
                    //TownName_Json();
                    clearmap(layer_);
                    filterMap(layer_, tableId, map);
                });
            //alert(CountyCheck.length);
        }

        /*function Geojson(tableId) {
            var query = "SELECT latitude, longitude, " +
                "COUNTY_ID , County_NAME, TOWN_NAME " +
                "FROM 1OUevGG1bi9g8ULlTdjvGdkRjy4kYhokkSuNZedG3 ";
            var where = generateWhere();
            if (where) {
                query += "WHERE " + where;
            }
            var queryText = encodeURIComponent(query);

            var url = ['https://www.googleapis.com/fusiontables/v2/query'];
            url.push('?sql=' + queryText);
            url.push('&key=AIzaSyDYnfgKBk-W_pXHjuYYSemkPFNFZhGQ-Q0');
            //url.push('&callback=TownName_Json');

            $.ajax({
                type: 'GET',
                url: url.join(''),
                jsonpCallback: 'jsonCallback',
                dataType: 'json',
                success: function(data) {
                    //console.log(data);
                    dataLength = data.rows.length;
                    for (var i = 0; i < dataLength; i++) {
                        var lng = data.rows[i][0];
                        var lat = data.rows[i][1];
                        var town = data.rows[i][4];
                        mapLabel = new MapLabel({
                            minZoom: 9,
                            text: town,
                            position: new google.maps.LatLng(lat, lng),
                            map: map,
                            fontSize: 16,
                            fontColor: '#ffff00',
                            strokeWeight: 5,
                            strokeColor: '#000000',
                            zIndex: 2,
                            align: 'center'
                        });
                        mapLabel.set('position', mapLabel.position);
                    }
                    dataLength = data.rows.length;
                    return dataLength;
                },
                error: function() {
                    alert("ERROR!!!");
                }
            });
        }*/


    }

    google.maps.event.addDomListener(window, 'load', initialize);

    var dataLength;

    function filterMap(layer_, tableId, map) {
        var where = generateWhere();
        console.log(where);
        for (var i = 0; i < tableId.length; i++) {
            if (where) {
                if (!layer_[i].getMap()) {
                    layer_[i].setMap(map);
                }
                layer_[i].setOptions({
                    query: {
                        select: 'geometry',
                        from: tableId[i],
                        where: where
                    },
                    styleId: 3,
                    templateId: 3,
                    map: map
                });
                /*for (var i = 1; i < tableId.length; i++) {
                    if (!layer_[i].getMap()) {
                        layer_[i].setMap(map);
                    }
                    layer_[i].setOptions({
                        query: {
                            select: 'geometry',
                            from: tableId[i],
                            where: where
                        },
                        styleId: 3,
                        templateId: 3,
                        map: map
                    });
                };*/

            } /*else {
                for (var i = 0; i < tableId.length; i++) {
                    layer_[i].setMap(null);
                };*/
            };
        }
    


    function changeLayer(tableidselections) {

        if (tableidselections == 2010) {
            tableId[0] = '1lqsAhcETs5M8sY-GF7tYWdq-xLZ_x68iIUDeXIoA';
            tableId[1] = '1PPpjBqOmjtpbGWz-3nZ6RHdNzAQ-rjHYi663OoOL';
            infowindow.close();
            clearmap(layer_);
            filterMap(layer_, tableId, map);
        }

        if (tableidselections == 2012) {
            tableId[0] = '1Zk9P-yNLAwTOnqtKg_WVDHVOcAZngeG2EXaClUnV';
            tableId[1] = '1EDxYgNYTf5Mndb8Gc9pbUlV86XNNqklzGT5QTHiR';
            infowindow.close();
            clearmap(layer_);
            filterMap(layer_, tableId, map);
        }

        if (tableidselections == 2014) {
            tableId[0] = '1MYUia1wz4XNWpDQCtXv578RFD2_lstUSP4rGsnTp';
            tableId[1] = '1FqGIwoYhlY7rLHE8-Nu4fRwQF6gslPKsl8C_6sh-';
            infowindow.close();
            clearmap(layer_);
            filterMap(layer_, tableId, map);
        }

        if (tableidselections == 2016) {
            tableId[0] = '14Ed9nevtW7HkrjsxeU5KQ0b_kuw0OWFbCVL_aXRj';
            tableId[1] = '1WU0EaP4qUlfo7VlJ_1nCstaYzVcpz-wssQogfOlA';
            infowindow.close();
            clearmap(layer_);
            filterMap(layer_, tableId, map);
        }

    }

    function clearmap(layer_) {
        for (var i = 0; i < tableId.length; i++) {
            if (layer_[i] != null) {
                layer_[i].setMap(null);
            }
        };
    }

    function generateWhere() {
        var filter = [];
        var stores = document.getElementsByName('store');
        for (var i = 0, store; store = stores[i]; i++) {
            if (store.checked) {
                var storeName = store.value.replace(/'/g, '\\\'');
                filter.push("'" + storeName + "'");
            }
        }
        var where = '';
        if (filter.length) {
            where = "COUNTY_ID IN (" + filter.join(',') + ')';
        }
        //console.log(where);
        return where;
    }