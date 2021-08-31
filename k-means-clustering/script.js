var k=3;
var sum=0;
var clustersArray=[];
var studentsArray=[];
var subjectDistanceArray=[];
var euclideanDistanceArray=[];
var sumArray=[];
var subjectsArray=["Ab Studies","Biology","Bus Ent","Chem","Child St","Dance","D&T","Digital Technologies","Drama","English","English Lit Studies","French","F&H","Gen Maths","Geography","History","IP","Math Meth","Music","PE","Physics","Psychology","Spec Maths","WP Prac","Vetamorphus","VET","VART"];
var currentAssign = 0;
var nearestAssign = 0;
var studentClusterAssignment=[];
var distanceClusterArray=[];
var c1Array=[];
var c2Array=[];
var c3Array=[];
var c4Array=[];
var c5Array=[];
var c6Array=[];
var c7Array=[];
var c8Array=[];
var c9Array=[];
var c10Array=[];

function student(studentNo,distances){
    this.studentNumber = studentNo;
    this.distances=distances;
}


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

    $('#generateDistances').click(function(){
        generateRandomClusters();
        generateDistances();
    })

    $('#runAlgorithm').click(function(){
        console.clear();
        console.log(data);

        studentsArray=[];

        generateRandomClusters();
        generateDistances();
        nearestDistance();
        convertDistanceToClusterNumber();

        console.log( studentsArray );  
        console.log(studentsArray[0]["distances"].length); 
        //console.log(studentClusterAssignment);

        //calculateNewClusters();
    })

    function generateRandomClusters(){
        clustersArray=[];
        for(var i=0;i<k;i++){
            var randomStudent=Math.floor(Math.random()*88);
            console.log(randomStudent);
            for(var j=0;j<data.length;j++){
                if(j==randomStudent){
                    clustersArray.push(data[j-1]);
                }
            }
        }

        clustersArray=[ data[0] , data[20] , data[40] ];
        console.clear();
        console.log(clustersArray);
    }

    function generateDistances(){
        
        for(var i=0;i<data.length;i++){ // euclidean distance

            sumArray=[];
            euclideanDistanceArray=[];

            for(var x=0;x<k;x++){
                
                subjectDistanceArray=[];
                sum=0;
    
                for(var j=0;j<subjectsArray.length;j++){ 
                    var clusterSubject=Math.pow( ( parseInt(clustersArray[x][ subjectsArray[j] ]) - parseInt(data[i][ subjectsArray[j] ]) ), 2); //x2-x1
                    subjectDistanceArray.push(clusterSubject);
    
                }
    
                for(var j=0;j<subjectDistanceArray.length;j++){
                    sum = sum + subjectDistanceArray[j]; // sum of x2-x1 +...for all subjects from clusters
                }

                euclideanDistanceArray.push( Math.sqrt(sum) )
            }

            studentsArray.push( new student( 
                (i+1) , euclideanDistanceArray
            ))

        }
    }
        
    function nearestDistance(){

        studentClusterAssignment=[];

        for(var i=0;i<data.length;i++){ // find smallest cluster distance

            for(var j=0;j<k;j++){
                currentAssign = studentsArray[i]["distances"][j]; // cluster1

                if(j==0){
                    nearestAssign = currentAssign;
                }

                if( currentAssign < nearestAssign ){ // if current <= next
                    
                    nearestAssign = currentAssign;

                }else if( currentAssign == nearestAssign){
                    
                    nearestAssign = currentAssign;

                }else if( nearestAssign < currentAssign ){
                    
                }
            }
            
            studentClusterAssignment.push(nearestAssign);

        }
        console.log(studentClusterAssignment);
    }

    function convertDistanceToClusterNumber(){

        for(var i=0;i<data.length;i++){ // convert nearest distance to cluster number

            for(var j=0;j<k;j++){

                if(studentClusterAssignment[i] == studentsArray[i]["distances"][j]){
                    
                    studentClusterAssignment[i] = j+1;

                }

            }

        }
        console.log(studentClusterAssignment);

    }

    function calculateNewClusters(){
        
        clustersArray=[];

        for(var i=0;i<k;i++){
            for(var j=0;j<studentClusterAssignment.length;j++){
                for(var l=0;l<subjectsArray.length;l++){
                    
                }
            }
        }

        for(var i=0;i<studentClusterAssignment.length;i++){ // run through dataset

            for(var j=0;j<k;j++){ // run for each cluster
                var kSum=0;
                for( var l=0;l<subjectsArray;l++ ){ // run through all subjects
                    kSum=kSum+ data[i][l];
                }
                //clustersArray.push(kSum/);
            }

        }

            if(studentClusterAssignment[i] == 1){
                k1Array.push(i);
            }else if(studentClusterAssignment[i] == 2){
                k2Array.push(i);
            }else if(studentClusterAssignment[i] == 3){
                k3Array.push(i);
            }else if(studentClusterAssignment[i] == 4){
                k4Array.push(i);
            }else if(studentClusterAssignment[i] == 5){
                k5Array.push(i);
            }else if(studentClusterAssignment[i] == 6){
                k6Array.push(i);
            }else if(studentClusterAssignment[i] == 7){
                k7Array.push(i);
            }else if(studentClusterAssignment[i] == 8){
                k8Array.push(i);
            }else if(studentClusterAssignment[i] == 9){
                k9Array.push(i);
            }else if(studentClusterAssignment[i] == 10){
                k10Array.push(i);
            }

        clustersArray=[];
        
                var kSum=0;
                
                
                if(k==1){
    
                }else if(k==2){
    
                }else if(k==3){
    
                }else if(k==4){
    
                }else if(k==5){
                    
                }else if(k==6){
    
                }else if(k==7){
    
                }else if(k==8){
    
                }else if(k==9){
    
                }else if(k==10){
    
                }else{
                    console.log("functionality not developed");
                }


    }

    function findAverage(inputArray){
        for(var m=0;m<inputArray.length;m++){
    
            var kSum=0;
            var kAverage=0;

            for(var l=0;l<data.length;l++){
                kSum=kSum+inputArray[m];
            }
            kAverage=kSum/(inputArray.length);

        }
        console.log(kAverage);
    }

});