function initScheme() {
    window.lines1 = []; // массив координат всех нарисованных линий (x0, y0, xn, yn)
    window.lines2 = [];
    window.lines3 = [];

    window.areas1 = [{x: 134, y: 134}, {x: 288, y: 134}, {x: 288, y: 230}]; // массив круглых областей в которых происходит клик
    window.areas2 = [];
    window.areas3 = [];
    window.r = 10;
    window.inCircle;
    window.clickedCircles;
    window.ctxs = [];
    //window.imageid = {"std_component_1": "bolthideimg1", "std_component_2": "bolthideimg2", "std_component_3": "bolthideimg3"};

    window.isEnded = false;

    $('.canvimg')[2].style = "height: 28.3vw;";

    inter = setInterval(function ()
    {
        if ($('.canvimg')[0].width != 0 && $('.canvimg')[2].width != 0)
        {
            resizecanv();
            clearInterval(inter);
        }
    }, 10);

    function resizecanv()
    {
        for (i = 0; i < 3; i++)
        {
            $('canvas')[i].width = $(".canvimg")[i].width;
            $('canvas')[i].height = $(".canvimg")[i].height;
            window.ctxs[i].lineWidth = 3;
        }
    }

    $(window).resize(function() {
        resizecanv();
    });

    canvas = document.getElementsByTagName("canvas");
    for (i = 0; i < 3; i++) {
        window.ctxs[i] = canvas[i].getContext("2d");
        window.ctxs[i].fillStyle = "white";
        window.ctxs[i].lineWidth = 5;
    }

    $("#ready").click(function () {
        for (j = 0; j < 3; j++) {
            eval('canv' + (j + 1).toString()).style.display = 'none';
            try {
                $(".canvimg")[0].className += 'done';
            } catch (err) {
                alert('Отрисовка уже выполнена');
                break;
            }
            window.isEnded = true;
        }
    });

    $("section div canvas").mousedown(function (e) {
        e.preventDefault();
        if (isEnded == false) {
            window.down = true;
            n = $(this)[0].id;
            rect = e.target.getBoundingClientRect();
            x = e.clientX - rect.left - 8;
            y = e.clientY - rect.top - 8;

            for (i = 0; i < 3; i++) {
                if (n == ctxs[i].canvas.id) {
                    window.gx = x;
                    window.gy = y;

                    /*  ctxs[i].beginPath();
                     ctxs[i].arc(areas1[0].x, areas1[0].y, r, 0, 2 * Math.PI, 0);
                     ctxs[i].stroke();
                     ctxs[i].beginPath();
                     ctxs[i].arc(areas1[1].x, areas1[1].y, r, 0, 2 * Math.PI, 0); //рисуем два круга по координатам в массиве радиуса r
                     ctxs[i].stroke();
                     ctxs[i].beginPath();
                     ctxs[i].arc(areas1[2].x, areas1[2].y, r, 0, 2 * Math.PI, 0);
                     ctxs[i].stroke(); */

                    for (j = 0; j < areas1.length; j++) {
                        dx = x - areas1[j].x;
                        dy = y - areas1[j].y;
                        if (dx * dx + dy * dy < r * r) {
                            window.clickedCircles = j;
                            //info.innerText += 'down:В круге №' + (j + 1) + '\n';
                            break;
                            //clickedCircles.push(j);
                        } else {
                            window.clickedCircles = undefined;
                            //info.innerText += 'down:Не в круге №' + (j + 1) + '\n';
                            //clickedCircles.splice(j, 1);
                        }
                    }
                    break;
                }
            }
        }


    }).mouseup(function (e) {
        if (isEnded == false) {
            window.down = false;
            n = $(this)[0].id;

            rect = e.target.getBoundingClientRect();
            x = e.clientX - rect.left - 8;
            y = e.clientY - rect.top - 8;

            for (i = 0; i < 3; i++) {
                if (n == ctxs[i].canvas.id) {
                    /*thisarrlines = eval('lines' + n[4]);
                    thisarrlines.push([gx, gy, window.endx, window.endy]);
                    drawall(ctxs[i]);*/

                    if (window.clickedCircles != undefined) {
                        for (j = 0; j < areas1.length; j++) {
                            dx = x - areas1[j].x;
                            dy = y - areas1[j].y;
                            if (dx * dx + dy * dy < r * r) {
                                //info.innerText += 'up:В круге №' + (j + 1) + '\n';
                                ctxs[i].beginPath();
                                ctxs[i].clearRect(0, 0, document.getElementsByTagName("canvas")[ctxs[i].canvas.id].width, document.getElementsByTagName("canvas")[ctxs[i].canvas.id].height);
                                ctxs[i].moveTo(areas1[clickedCircles].x, areas1[clickedCircles].y);
                                ctxs[i].lineTo(areas1[j].x, areas1[j].y);
                                ctxs[i].stroke();
                            } else {
                                //info.innerText += 'up:Не в круге №' + (j + 1) + '\n';
                                //clickedCircles = undefined;
                            }
                        }
                    }
                    break;
                }
            }
        }

    }).mouseout(function () {
        window.down = false;
    }).mouseover(function () {

    });


    $("section div canvas").mousemove(function (e) {
        if (window.down == true) {
            n = $(this)[0].id;
            rect = e.target.getBoundingClientRect();
            x = e.clientX - rect.left - 8;
            y = e.clientY - rect.top - 8;
            window.endx = x;
            window.endy = y;
            for (i = 0; i < 3; i++) {
                if (n == ctxs[i].canvas.id) {
                    drawline(ctxs[i], x, y);
                    break;
                }
            }
        }
    });

    $("#default1").click(function () {
        if (isEnded) {
            check1.click();
        } else {
            alert('Необходимо закончить рисование и нажать "Готово"');
        }

    });

    $("#default2").click(function () {
        if (isEnded) {
            check2.click();
        } else {
            alert('Необходимо закончить рисование и нажать "Готово"');
        }

    });

    $("#check1").click(function () {
        if (isEnded) {
            if ($(this)[0].checked) {
                for (i = 1; i < 6; i++) {
                    eval('bolthideimg' + i).style.display = '';
                }
            } else {
                //for (j=0;j<3;j++) {document.getElementsByClassName("canvimgdone")[0].className = document.getElementsByClassName("canvimgdone")[0].className.substr(0,7);}
                for (i = 1; i < 6; i++) {
                    eval('bolthideimg' + i).style.display = 'none';
                }
            }
        } else {
            $(this)[0].checked = false;
            alert('Необходимо закончить рисование и нажать "Готово"');
        }

    });

    $("#check2").click(function () {
        if (isEnded) {
            if ($(this)[0].checked) {
                for (i = 1; i < 6; i++) {
                    eval('bolthideimg' + i + i).style.display = '';
                }
            } else {
                //for (j=0;j<3;j++) {document.getElementsByClassName("canvimgdone")[0].className = document.getElementsByClassName("canvimgdone")[0].className.substr(0,7);}
                for (i = 1; i < 6; i++) {
                    eval('bolthideimg' + i + i).style.display = 'none';
                }
            }
        } else {
            $(this)[0].checked = false;
            alert('Необходимо закончить рисование и нажать "Готово"');
        }

    });

    /*$("body").mousedown(function (e) {
        e.preventDefault();
    }).mousemove(function (e) {
        e.preventDefault();
    });*/

}

/* function PdmOrStdHandler(event, data) {
    if (data.message_id === "checkedPdmComponents") {
        let data = data.data;

    } else if (data.message_id === "checkedStdComponents") {
        let data = data.data.join(", ");

    }
} */


function line(ctx, x, y) {
    window.gx = x;
    window.gy = y;
}

function drawline(ctx, x, y) {
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(x, y);
    window.gx = x;
    window.gy = y;
    //ctx.clearRect(0, 0, document.getElementsByTagName("canvas")[ctx.canvas.id].width, document.getElementsByTagName("canvas")[ctx.canvas.id].height);
    ctx.stroke();
    //drawall(ctx);
} // при движении мыши рисовать линию

function drawall(ctx) {
    for (i = 0; i < 3; i++) {
        if (n == ctxs[i].canvas.id) {
            ctx.beginPath();
            thisarrlines = eval('lines' + n[4]);
            for (i = 0; i < thisarrlines.length; i++) {
                aa = thisarrlines[i][0];
                bb = thisarrlines[i][1];
                aa1 = thisarrlines[i][2];
                bb1 = thisarrlines[i][3];
                //ctx.arc(134, 134, 10, 0, 2*Math.PI, 0);
                //ctx.arc(288, 134, 10, 0, 2*Math.PI, 0);
                ctx.moveTo(aa, bb);
                ctx.lineTo(aa1, bb1);
                ctx.stroke();
            }
            break;
        }
    }

} // нарисовать все линии после очистки canvas


