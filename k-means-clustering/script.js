var sum=0;
var clustersArray=[];
var studentsArray=[];
var subjectDistanceArray=[];
var euclideanDistanceArray=[];
var subjectsArray=["Ab Studies","Biology","Bus Ent","Chem","Child St","Dance","D&T","Digital Technologies","Drama","English","English Lit Studies","French","F&H","Gen Maths","Geography","History","IP","Math Meth","Music","PE","Physics","Psychology","Spec Maths","WP Prac","Vetamorphus","VET","VART"];
var currentAssign = 0;
var nearestAssign = 0;
var studentClusterAssignment=[];
var distanceClusterArray=[];
var current = 0;
var first = 0;
var k=0;
var unstable = 1;

//this is the master

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

        k=parseInt( $('#kNumber').val() );
        if( $('#kNumber').val() == "" ){
            k=0;
        }

        generateRandomClusters();
        generateFirstDistances();
        nearestDistance();
        convertDistanceToClusterNumber();

        while(unstable == 1){
            calculateNewClusters();

            generateDistances();
            nearestDistance();
            convertDistanceToClusterNumber();
            checkStability();
            
        }

    })

    function generateRandomClusters(){
        clustersArray=[];

        for(var i=1;i<k;i++){
            var randomStudent=Math.floor(Math.random()*88);

            if(i==1){
                clustersArray.push( data[11] );
            }

            //console.log(randomStudent);

            for(var j=0;j<data.length;j++){

                if(j == randomStudent){

                    clustersArray.push(data[j-1]);

                }

            }
        }

        clustersArray=[ data[11] , data[51] , data[32] ];
        k=clustersArray.length;
        console.clear();
        console.log(clustersArray);
    }

    function generateFirstDistances(){
        
        for(var i=0;i<data.length;i++){ // euclidean distance

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
        console.log( studentsArray );  
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
            clustersArray.push([]);
        }

        for(var i=1;i<k+1;i++){ //loop through clusters
            for(var j=0;j<subjectsArray.length;j++){ //loop through subjects
                var kSum=0;
                var kCount=0;

                for(var l=0;l<studentClusterAssignment.length;l++){ //loop through students

                    if(studentClusterAssignment[l] == i){
                        kSum= kSum+ parseInt( data[l][ subjectsArray[j] ] );
                        kCount=kCount+1;
                    }

                }

                clustersArray[i-1].push( kSum/kCount );

            }
        }

        console.log(clustersArray);

    }

    function checkStability(){
        var stabilitySum = 0 ;
        var previousStudentClusterAssignment=[];

        for(var i=0;i<studentClusterAssignment.length;i++){
            if(studentClusterAssignment[i] == previousStudentClusterAssignment[i]){
                stabilitySum=stabilitySum+1;
            }
        }

        if(stabilitySum == studentClusterAssignment.length){
            unstable = 0;
        }

    }

    function generateDistances(){
        studentsArray=[];
        for(var i=0;i<data.length;i++){ // euclidean distance

            euclideanDistanceArray=[];

            for(var x=0;x<k;x++){
                
                subjectDistanceArray=[];
                sum=0;
                
                for(var j=0;j<subjectsArray.length;j++){ 
                    var clusterSubject=Math.pow( ( parseInt(clustersArray[x][j]) - parseInt(data[i][ subjectsArray[j] ]) ), 2); //x2-x1
                    subjectDistanceArray.push(clusterSubject);
                    
                }
                
                for(var j=0;j<subjectDistanceArray.length;j++){
                    sum = sum + subjectDistanceArray[j]; // sum of x2-x1 +...for all subjects from clusters
                }

                euclideanDistanceArray.push( Math.sqrt(sum) );
            }

            studentsArray.push( new student( 
                (i+1) , euclideanDistanceArray
            ))

        }
        console.log(studentsArray);
    }

});