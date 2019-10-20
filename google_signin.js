// var provider = null;
// function start(){
//     var provider = new firebase.auth.GoogleAuthProvider();
//     firebase.auth().signInWithRedirect(provider);
//     //   window.alert(typeof(start));
// }
var loginUser = null;

function onSignIn(googleUser) {
    console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!isUserEqual(googleUser, firebaseUser)) {
            // Build Firebase credential with the Google ID token.
            var credential = firebase.auth.GoogleAuthProvider.credential(
                googleUser.getAuthResponse().id_token);
            // Sign in with credential from the Google user.
            firebase.auth().signInWithCredential(credential).then(function (result) {
                loginUser = googleUser.getBasicProfile();
                // console.log("Result ", result);
                // console.log("User", user);
                // console.log("Success fully signed in");

                //initializing var
                var signInButton = document.getElementById("sign-in-button");
                var profile = document.getElementById("profile");
                var emailContainer = document.getElementById("email");
                var signOutButton = document.getElementById("sign-out-button");

                signInButton.className = "g-signin2 hide";
                profile.className = "show";
                signOutButton.className = "show";

                emailContainer.innerHTML = "Email " + loginUser.getEmail();

                fillotherdetails(result.user);
            })
                .catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // The email of the user's account used.
                    var email = error.email;
                    // The firebase.auth.AuthCredential type that was used.
                    var credential = error.credential;
                    window.alert(errorMessage);
                    // ...
                });
        } else {
            loginUser = googleUser.getBasicProfile();

            var signInButton = document.getElementById("sign-in-button");
            var profile = document.getElementById("profile");
            var emailContainer = document.getElementById("email");
            var signOutButton = document.getElementById("sign-out-button");

            signInButton.className = "g-signin2 hide";
            profile.className = "show";
            signOutButton.className = "show";

            // window.alert(user.getId());
            // window.alert(user.getEmail());
            // window.alert(user.getName());
            emailContainer.innerHTML = "Email " + user.getEmail();

            fillotherdetails(loginUser, firebaseUser);
            console.log('User already signed-in Firebase.');
            // console.log("Google User", googleUser);
            console.log("Firebase User", firebaseUser);
        }
    });
}
function isUserEqual(googleUser, firebaseUser) {
    if (firebaseUser) {
        var providerData = firebaseUser.providerData;
        for (var i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                providerData[i].uid === googleUser.getBasicProfile().getId()) {
                // We don't need to reauth the Firebase connection.
                return true;
            }
        }
    }
    return false;
}

function fillotherdetails(firebaseUser) {
    var id = firebaseUser.uid;
    var db = firebase.database();
    var ref = db.ref('users/' + id);

    ref.on('value', function (snapshot) {
        userDetails = snapshot.val();
        console.log("id", id);
        //   console.log("uid",user.getUId());
        //   console.log("userDetails", userDetails);
        //   window.alert(userDetails);
        if (!userDetails) {
            //   window.alert("going to show id container");
            showCreateIdContainer();
        } else {
            // window.alert("show details container");
            // document.getElementById("name").innerHTML = user.getName();
            document.getElementById("name").innerHTML = userDetails.name;
            document.getElementById("festid").innerHTML = userDetails.festid;
            hideCreateIdContainer();
            showDetailsContainer();
        }
    });
}
function hideCreateIdContainer() {
    document.getElementById("create-id-container").className = "hide";
}
function showCreateIdContainer() {
    document.getElementById("create-id-container").className = "show";
}
function hideDetailsContainer() {
    document.getElementById("details-container").className = "hide";
}
function showDetailsContainer() {
    document.getElementById("details-container").className = "show";
}
function setData() {
    try{
        //Initialize Elements
    var db = firebase.database();
    var mName = document.getElementById("name");
    var mCollege = document.getElementById("college");
    var mNumber = document.getElementById("number");
    var mMnitians = document.getElementById("mnitians");

    //Store value in string
    var name = mName.value;
    var college = mCollege.value;
    var number = mNumber.value;
    var mnitians = mMnitians.value;

    //Some hardcoded data
    //Todo-
    //1) Add real festid
    var festid = "fest@1234"

    var uniqueId = "uniqueId";
    // var uniqueId = loginUser.getId();
    var userDetails = {
        name: name,
        college: college,
        phone: number,
        mnitians: mnitians,
        festid: festid
    };

    db.ref('users/' + uniqueId).set(userDetails);
    location.href = './register2.html';
    }catch(error){
        // Handle Errors here.
        // var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        // var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        // var credential = error.credential;
        window.alert(errorMessage);
        // ...
    }
}