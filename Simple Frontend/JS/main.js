$(document).ready(function () {
  // init states
  $("#alert").hide()
  $("#upload").hide()
  $("#video").hide()
  $("#submitToAPI").hide();
  $("#alias").hide();

  // set functions
  $("#generate").click(function () {
    var seed = $("#seed").val();
    var walletAdd = $("#wallet").val();
    if (seed === '') {
      M.toast({ html: "please set a password to generate wallet!" })

      // $("#alert").html("please set a password to generate wallet!")
      // $("#alert").show()
    }
    else{
      $("#alert").hide()
      // var settings = {
      //     "async": true,
      //     "crossDomain": true,
      //     "url": "http://172.16.21.223:3000/api/platform/register",
      //     "dataType": "json",
      //     "method": "POST",
      //     "headers": {
      //         "Content-Type": "application/json",
      //         "Accept": "application/json"
      //     },
      //     "processData": false,
      //
      //     "data": {password: "seed" }
      // }
      //
      // $.ajax(settings).done(function (response) {
      //     console.log(response);
      //     $("#register").html(response);
      // });
      $.ajax({
        type: 'POST',
        url: "http://172.16.21.223:3000/api/platform/register",
        data: JSON.stringify({
          'password': seed
        }),
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
          console.log(result);
          $("#register").html("Your Wallet address is: "+result.result);
        },
        error: function (err) {
          console.log(err);
          M.toast({ html: "Invalid credentials!" })

        }
      });
    }
  })

  $("#checkin").click(function (){
    var wallet = $("#wallet").val();
    var seed = $("#seed").val();
    if (seed === '' || wallet==='') {
      M.toast({ html: "please enter credentials to checkin!" })
      // $("#alert").html("please enter some credentials to checkin!")
      // $("#alert").show()
    }
    else {
      $("#alert").hide()
      var status = ""
      // TODO: call api to checkin heartbeat and set status

      $.ajax({
        type: 'POST',
        url: "http://172.16.21.223:3000/api/platform/getHeartbeat",
        data: JSON.stringify({
          'password': seed,
          'walletAddress': wallet
        }),
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
          console.log("adhgs0", result);
          status = "success";
          $("#upload").show()
          $("#alias").show()
          $("#login").hide()
          $("#checkinBtn").hide()
          $("#register").hide()
          $("#submitToAPI").show();
          var files;
          $('#fileInput').on('change', prepareUpload);
          function prepareUpload(event){
            console.log(event)
            files = event.target.files;
          };
          $("#submitToAPI").click(function(){
            if($("alias1").val()===""||$("alias2").val()===""||$("heartbeatDays").val()===""){
              M.toast({ html: "Please enter required details!" })
            }


            else{
              var form = new FormData();
                 // form.append("file", "");
                 console.log(files);
              form.append("walletAddress", wallet);
              form.append("password", seed);
              form.append("alias1", $("#alias1").val());
              form.append("alias2", $("#alias2").val());
              form.append("file",files[0]);
              // $.each(files, function(key, value){
              //   form.append(key, value);
              // });
              console.log(form);
              $.ajax({
                type: 'POST',
                url: "http://172.16.21.223:3000/api/platform/uploadDocument",
                data: form,
                contentType: false,
                processData: false,
                mimeType: "multipart/form-data",
                success: function (result) {
                  if(result.result==="true"){
                  console.log(result);
                  status = "success";
                  M.toast({ html: "File successfully uploaded!" })
                  $("#submitToAPI").hide();

                }
                },
                error: function (err) {
                  console.log(err);
                }
              });
            }
          })
        },
        error: function (err) {
          console.log(err);
          M.toast({ html: "Invalid checkin credentials!" })

        }
      });

    }
  })

  $("#uploadButton").click(function(){
    $("#fileInput").click()
  })

  $("#record").click(function(){
    $("#buttons").hide()
    $("#video").show()
    startFunction()
  })

  $("#uploadToChainButton").click(function () {
    downloadVideo()
  })
});
