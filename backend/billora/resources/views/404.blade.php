<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>404 Page Not Found</title>

<style>
*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:Arial, Helvetica, sans-serif;
}

body{
    background:#f3f8f8;
    display:flex;
    justify-content:center;
    align-items:center;
    height:100vh;
}

.container{
    width:900px;
    height:500px;
    position:relative;
}

.text{
    position:absolute;
    right:120px;
    top:60px;
    text-align:center;
}

.text h1{
    font-size:70px;
    color:#365b61;
    font-weight:300;
    letter-spacing:2px;
}

.text h2{
    margin-top:10px;
    color:#ff6b21;
    font-size:34px;
    font-weight:300;
}

/* Penguin */

.penguin{
    position:absolute;
    left:180px;
    bottom:70px;
    width:120px;
    height:160px;
}

.body{
    width:100px;
    height:130px;
    background:#323846;
    border-radius:50%;
    position:absolute;
    left:10px;
}


.belly{
    width:70px;
    height:95px;
    background:white;
    border-radius:50%;
    position:absolute;
    top:15px;
    left:15px;
}

.eye{
    width:8px;
    height:8px;
    background:#444;
    border-radius:50%;
    position:absolute;
    top:35px;
}

.eye.left{
    left:28px;
}

.eye.right{
    right:28px;
}

.beak{
    width:16px;
    height:12px;
    background:#ff9f1c;
    border-radius:50%;
    position:absolute;
    left:42px;
    top:52px;
}

.arm-left,
.arm-right{
    width:18px;
    height:65px;
    background:#323846;
    position:absolute;
    top:40px;
    border-radius:20px;
}

.arm-left{
    left:-5px;
    transform:rotate(15deg);
}

.arm-right{
    right:-5px;
    transform:rotate(-15deg);
}

.leg{
    width:18px;
    height:8px;
    background:#ffb000;
    border-radius:20px;
    position:absolute;
    bottom:-6px;
}

.leg.left{
    left:25px;
}

.leg.right{
    right:25px;
}

/* Shadow */

.shadow{
    position:absolute;
    width:150px;
    height:30px;
    background:#94c9cf;
    border-radius:50%;
    left:305px;
    bottom:58px;
}

/* Fishing Rod */

.rod{
    position:absolute;
    width:4px;
    height:140px;
    background:#ff7a2d;
    left:287px;
    bottom:125px;
    transform:rotate(35deg);
    transform-origin:bottom;
}

.string{
    position:absolute;
    width:2px;
    height:95px;
    background:#555;
    left:368px;
    bottom:145px;
}

/* Sign */

.sign{
    position:absolute;
    width:120px;
    height:70px;
    background:#8fd8d3;
    border-radius:5px;
    left:315px;
    bottom:95px;
    transform:rotate(-10deg);
    box-shadow:0 5px 10px rgba(0,0,0,.15);
    display:flex;
    align-items:center;
    justify-content:center;
    text-align:center;
    font-weight:bold;
    color:#222;
    font-size:22px;
}

</style>
</head>
<body>

<div class="container">

    <div class="text">
        <h1>SORRY</h1>
        <h2>PAGE NOT FOUND</h2>
    </div>

    <div class="shadow"></div>

    <div class="penguin">
        <div class="body">
            <div class="belly"></div>

            <div class="eye left"></div>
            <div class="eye right"></div>

            <div class="beak"></div>

            <div class="arm-left"></div>
            <div class="arm-right"></div>

            <div class="leg left"></div>
            <div class="leg right"></div>
        </div>
    </div>

    <div class="rod"></div>
    <div class="string"></div>

    <div class="sign">
        ERROR<br>404
    </div>

</div>

</body>
</html>