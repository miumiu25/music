function getData(url){
    $.ajax({
        type:"GET",
        url:url,
        success:function(data){
            console.log(1);
        },
        error:function(){
            console.log("error");
        }
    })
}



getData('../mock/data.json');