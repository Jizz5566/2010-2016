
$.ajaxSetup({async: false});
var map, town, TW2016=[];

function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 8,
            center: {lat: 23.858987, lng:120.917631},
            styles: [{
                featureType:'administrative',
                elementType:'geometry.stroke',
                stylers: [{
                color: '#0000ff'
                },
                {
                    Weight: '4.00'
                }]
            }]
        });

        map.data.loadGeoJson('town3.json');

        map.data.setStyle({
            strokeWeight: 1,
            strokeOpacity: .7,
            strokeColor: '#000'
        });
        
        var infowindow = new google.maps.InfoWindow();

        map.data.addListener('mouseover', function(event) {
            map.data.revertStyle();
            map.data.overrideStyle(event.feature, {fillColor: '#ff0'});
            var coordinate = {lat: event.latLng.lat(), lng: event.latLng.lng()}; // 點擊時獲取滑鼠的經緯度座標
            infowindow.setPosition(coordinate); // 將資訊視窗的位置，設定為滑鼠的座標
            var name = event.feature.getProperty('COUNTYNAME') + event.feature.getProperty('TOWNNAME'); // 設定資訊視窗的內容為行政區名稱
            //infowindow.setContent('<span style="font-weight:bold; font-size:16px;>'+name+'</span>'); // 將資訊視窗打開在地圖上
            infowindow.open(map);
            $('#countytown').html('<div>' + name +'</div>') .removeClass('text-muted');
        });

        map.data.addListener('mouseout', function(event) {
            map.data.revertStyle();
            $('#countytown').html('在地圖上滑動顯示鄉鎮區名稱').addClass('text-muted');
            infowindow.setContent(' '); 
        });
        
        var content, key, KMT, DPP, PFP;
        
        $.getJSON('data/2016.json', function (data) {
           TW2016 = data;
        });
                      
        map.data.addListener('click',  function(event) {
            infowindow.close(map);
            var votes, people, valid;
            var townkey = event.feature.getProperty('TOWNCODE') ,
                townname = event.feature.getProperty('TOWNNAME'),
                countyname = event.feature.getProperty('COUNTYNAME');
                key = countyname +townname
                if (TW2016[townkey]) {
                    TW2016[townkey].forEach(function (val) {
                            votes = val.Votes,
                            Vpeople = val.ValidPeople,
                            Vvotes = val.ValidVotes,
                            KMT = val.KMT,
                            DPP = val.DPP,
                            PFP = val.PFP,
                            DPP2 = Number(( DPP / Vvotes * 100).toFixed(2)),
                            KMT2 = Number(( KMT / Vvotes * 100).toFixed(2)),
                            PFP2 = Number(( PFP / Vvotes * 100).toFixed(2));
                    });
                }
                content = 
                '<table class="tg" align="center" style="width:200px;">' +
                '<tr>' +
                '<th class="tg-i8ik" colspan="3">' + countyname + townname + '</th>' +
                '</tr>' +
                '<td class="tg-hgcj">' + '2016選舉人數：</td>' +
                '<td class="tg-s6z2" style="font-weight:bold; font-size:16px;" colspan="2">' + Vpeople + '人</td>' +
                '</tr>' +
                '<tr>' +
                '<td class="tg-hgcj">投票率：</td>' +
                '<td class="tg-s6z2" style="font-weight:bold; font-size:16px;">' + (Vvotes / Vpeople * 100).toFixed(2) + '%' + '</td>' +
                '</tr>' +
                '</table>'; 
        $(function() {
                Highcharts.setOptions({
                    colors: ['#00C800', '#0000FF', '#FF6207']
                });
            $('#container').highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: key + "候選人得票數"
                },
                xAxis: {
                    categories: [
                        '2016年藍綠得票比較'
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
                    name: '民進黨',
                    data: [DPP]
                }, {
                    name: '國民黨',
                    data: [KMT]
                }, {
                    name: '親民黨',
                    data: [PFP]
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
                    text: townname + "得票率分佈"
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
                    name: "得票率",
                    colorByPoint: true,
                    data: [{
                        name: '民進黨',
                        y: DPP2,
                        sliced: true,
                        selected: true
                    }, {
                        name: '國民黨',
                        y: KMT2
                    }, {
                        name: '親民黨',
                        y: PFP2
                    }]
                }]
                });
        });        
            coordinate = {lat: event.latLng.lat(), lng: event.latLng.lng()}; // 點擊時獲取滑鼠的經緯度座標
            infowindow.setPosition(coordinate); // 將資訊視窗的位置，設定為滑鼠的座標
            infowindow.setContent(content); // 將資訊視窗打開在地圖上
            infowindow.open(map);
        //$('#detail').html('<div>' + countyname + townname + '：' + KMT ) + '</div>').removeClass('col-md-12');

        });
        
        };
