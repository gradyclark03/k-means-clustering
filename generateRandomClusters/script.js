var k=2;
var clustersArray=[];

$(document).ready(function(){
    var data;

    $.ajax({
        
        url:"Year 12 Subject Choices 2021.csv", dataType:"text", async: false,
        success: function(result){
            
            var JSONfile = csvJSON(result);
           
            data = JSON.parse(JSONfile); //data now an object
            //console.log(Object.keys(data)); //looking at keys
            //console.log(JSON.stringify(data, null, 2)) //visualise data stucture
        }   
    })
    
    //var csv is the CSV file with headers
    function csvJSON(csv){

      var lines=csv.split("\n");

      var result = [];

      var headers=lines[0].split(",");

      for(var i=1;i<(lines.length-1);i++){

          var obj = {};
          var currentline=lines[i].split(",");

          for(var j=0;j<headers.length;j++){
              obj[headers[j]] = currentline[j];
          }

          result.push(obj);

      }

      //return result; //JavaScript object
      return JSON.stringify(result); //JSON
    }
    
    console.log(data);
    

    $('#generateClusters').click(function(){
        generateRandomClusters();
    })

    function generateRandomClusters(){
        clustersArray=[];
        for(var i=0;i<k;i++){
            var randomStudent=Math.floor(Math.random()*88);
            console.log(randomStudent);
            for(var j=0;j<88;j++){
                if(j==randomStudent){
                    clustersArray.push(data[j-1]);
                }
            }
        }
        console.log(clustersArray);
    }

});