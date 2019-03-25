function getData(url){
    $.ajax({
        type:"GET",
        url:url,
        success:function(data){
            console.log(data);
        },
        error:function(){
            console.log("error");
        }
    })
}



getData('../music/mock/data.json');
