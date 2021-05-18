// 写所有ajax请求的
showDataAjax();
let data = null;
let stuInfoShow = document.getElementById("stuInfoShow");
function showDataAjax(){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.status == 200 && xhr.readyState == 4){
            data = JSON.parse(xhr.responseText);
            if(data.length == 0){
                //数据库没有数据的情况
                stuInfoShow.innerHTML = `
                <ul>
                    <li>
                        <label>
                            <input type="checkbox">全选
                        </label>
                    </li>
                    <li>序号</li>
                    <li>姓名</li>
                    <li>性别</li>
                    <li>年龄</li>
                    <li>生日</li>
                    <li>手机号码</li>
                    <li>操作</li>
                </ul>
                <div class="noData"></div>
                `
            }else{
                showData(data)
            }
        }
    }
    xhr.open("GET","/showData",true)
    xhr.send()
}
//显示数据
 function showData(xinxi){
    stuInfoShow.innerHTML = `
    <ul>
        <li>
            <label>
                <input type="checkbox">全选
            </label>
        </li>
        <li>序号</li>
        <li>姓名</li>
        <li>性别</li>
        <li>年龄</li>
        <li>生日</li>
        <li>手机号码</li>
        <li>操作</li>
    </ul>
    `
     xinxi.forEach((ele,index) => {
        stuInfoShow.innerHTML += `
        <ul data_id=${ele._id}>
            <li><input type="checkbox"></li>
            <li>${index}</li>
            <li>${ele.stuName}</li>
            <li>${(ele.stuSex == 1?"男":"女")}</li>
            <li>${ele.stuAge}</li>
            <li>${ele.stuBirth}</li>
            <li>${ele.stuTel}</li>
            <li>
                <button class="modify">修改</button>
                <button class="delete" onclick="deleteData(this)">删除</button>
            </li>
        </ul>
        `
     });
 }

 //添加数据
 let add_info = document.getElementById("add_info");
 let addDataArea = document.getElementsByClassName("addDataArea")[0];
 let stuBirthYear = document.getElementById("stuBirthYear");
 let stuBirthMonth = document.getElementById("stuBirthMonth");
 let stuBirthDate = document.getElementById("stuBirthDate");
 let closeAdd = document.getElementsByClassName("closeAdd")[0];
 let sureAdd = document.getElementsByClassName("sureAdd")[0];
 let stuName = document.getElementById("stuName");
 let male = document.getElementById("male");
 let female = document.getElementById("female");
 let stuTel = document.getElementById("stuTel");
 let sex = null;
 //点击添加按钮出现弹出框
 add_info.onclick = function(){
    addDataArea.style.display = "block";
    for(let i = 1990;i<2021;i++){
        let opt = new Option(i,i);
        stuBirthYear.appendChild(opt)
    }
    for(let i = 1;i<13;i++){
        let opt = new Option(i,i);
        stuBirthMonth.appendChild(opt)
    }
    for(let i = 1;i<32;i++){
        let opt = new Option(i,i);
        stuBirthDate.appendChild(opt)
    }
 }
 //点击close图片则关闭弹出框
 closeAdd.onclick = function(){
    addDataArea.style.display = "none";
 }
 //点击弹框中的确认添加按钮，则发送ajax请求添加数据
 sureAdd.onclick = function(){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.status == 200 && xhr.readyState == 4){
           if(xhr.responseText == 1){
                addDataArea.style.display = "none";
                showDataAjax();
                stuName.value = "";
                stuTel.value = "";
           }else{
                addDataArea.style.display = "none";
                alert("添加失败！请重新尝试")
           }
        }
    }
    let stuID = data.length;
    let stuName1 = stuName.value;
    // let stuSex = sex;
    let stuAge = getAge(getBirth());
    let stuBirth = getBirth();
    let stuTel1 = stuTel.value;
    xhr.open("GET",`/addData?stuID=${stuID}&stuName=${stuName1}&stuSex=${sex}&stuAge=${stuAge}&stuBirth=${stuBirth}&stuTel=${stuTel1}`,true)
    xhr.send()
 }

 //获取添加数据中的性别
 function check(sexnum){
    if(sexnum == 1){
        male.checked = true;
        female.checked = "";
        sex = 1
    }else if(sexnum == 0){
        male.checked = "";
        female.checked = true;
        sex = 0
    }
 }
 //获取生日
 function getBirth(){
    // 19980505
    //199855
     let year = stuBirthYear.value;
     let month = stuBirthMonth.value;
     let day = stuBirthDate.value;
     let stuBirth = year + (month < 10 ? ("0" + month) : month) + (day < 10 ? ("0" + day) : day);
     return stuBirth;
 }

 //根据生日获取年龄
 function getAge(BirthDayStr){
     //判断生日字符串是否是8位数，使用正则表达式判断
     if(!/^\d{8}$/.test(BirthDayStr)){
         return "not a Birthaday";
     }
     let now = new Date()
     let age = now.getFullYear() - BirthDayStr.slice(0,4);
     if(Number( ("" + (now.getMonth() + 1) + now.getDate()) < Number(BirthDayStr.slice(4)))){
         age -= 1;
     }
     return age;
 }


//删除数据
function deleteData(nthis){
    let id = nthis.parentElement.parentElement.getAttribute("data_id");
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.status == 200 && xhr.readyState == 4){
            if(xhr.responseText == 1){
                showDataAjax();
                alert("删除成功")
           }else{
                alert("删除失败！请重新尝试")
           }
        }
    }
    xhr.open("GET",`/deleteData?delStuID=${id}`,true)
    xhr.send()
}
