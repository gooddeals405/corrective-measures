//=======================FIREBASE IMPORTS AND INITIALIZATION======================================
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import {
    getFirestore,
    collection,
    doc,
    getDoc,
    query,
    getDocs,
    orderBy,
    addDoc,
    deleteDoc,
    onSnapshot,
    setDoc
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: "AIzaSyBxM_vt4dG48Wmf6t3FmcKNReYmgtjjDxU",
//     authDomain: "correctivemeasures-7fd32.firebaseapp.com",
//     projectId: "correctivemeasures-7fd32",
//     storageBucket: "correctivemeasures-7fd32.appspot.com",
//     messagingSenderId: "732418944057",
//     appId: "1:732418944057:web:e1846d05b462557ce331e8",
//     measurementId: "G-8M80GCH78F"
//   };

const firebaseConfig = {

    apiKey: "AIzaSyBxM_vt4dG48Wmf6t3FmcKNReYmgtjjDxU",

    authDomain: "correctivemeasures-7fd32.firebaseapp.com",

    databaseURL: "https://correctivemeasures-7fd32-default-rtdb.firebaseio.com",

    projectId: "correctivemeasures-7fd32",

    storageBucket: "correctivemeasures-7fd32.appspot.com",

    messagingSenderId: "732418944057",

    appId: "1:732418944057:web:e1846d05b462557ce331e8",

    measurementId: "G-8M80GCH78F"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
//================================================================================================
//instanciate Pop Up Modals
document.addEventListener('DOMContentLoaded', function () {
    // get all modals
    var elems = document.querySelectorAll('.modal');
    //init them
    M.Modal.init(elems)
});

// as soon as page loads get data from database and create boards
let numOfBoards = 0;
let BoardsInDatabase = 0;

//When a board gets updated
const colRef = collection(db, 'Boards')
const q = query(colRef, orderBy("bTitle"));
onSnapshot(q, (querySnapshot) => {
    BoardsInDatabase = querySnapshot.size;
    console.log(BoardsInDatabase)
    createBoardsFromDB(querySnapshot)
})

function createBoardsFromDB(qSH) {
    qSH.forEach((doc) => {
        addBoard(doc.id)
        console.log('Board loaded, board ID =>', doc.id)

    })

}


const addBoardBtn = document.getElementById("add-board-btn")
if (addBoardBtn) {
    addBoardBtn.addEventListener("click", function (e) {
        console.log('click add board')
        e.preventDefault(); // stops default action
        addNewBoard()
    })
}



function addNewBoard() {

    const boardRef = collection(db, "Boards");
    addDoc(boardRef, {
        bTitle: `Board ${numOfBoards}`,
    })
        .then((docRef) => {
            console.log("Board created with ID: ", docRef.id);
            addBoard(docRef.id);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
}



function addBoard(id) {
    console.log('Boards in Database', BoardsInDatabase)
    console.log('Boards Created in Window', numOfBoards)
    numOfBoards++
    if (numOfBoards <= BoardsInDatabase) {
        // Create a new board element


        const newBoard = document.createElement('div');
        newBoard.classList.add('board');



        // Add the buttons to the new board
        let HTML = `
                <div class="container" style="margin: auto;">
                <ul id="TicketList" class="ticket-list">
                    <!-- TICKETS FROM DATABASE GET PUT IN MODULE AND STORED HERE -->
                </ul>
                <!-- Add Ticket Button -->
                <button class="btn btn-sm btn-outline-secondary modal-trigger modal-btn"
                    data-target="modal-addTicket">Add Ticket</button>
                <!-- Delete Ticket Button -->
                <button class="btn btn-sm btn-outline-secondary modal-trigger modal-btn" 
                    data-target="modal-deleteTicket">Delete Ticket</button>
                <!-- Delete Board Button -->
                    <button class="btn btn-sm btn-outline-secondary delete-board-btn" 
                    id="delete-board-btn">DELETE BOARD</button>
                </div>
            `;
        newBoard.innerHTML = HTML
        // Add the new board element to the board container
        const boardContainer = document.getElementById('board-container');
        boardContainer.appendChild(newBoard);
        newBoard.dataset.boardId = id;


        // Add event listeners to the new buttons
        const addTicketBtn = newBoard.querySelector('.modal-btn[data-target="modal-addTicket"]');
        const deleteTicketBtn = newBoard.querySelector('.modal-btn[data-target="modal-deleteTicket"]');
        const deleteBoardBtn = newBoard.querySelector('.delete-board-btn');

        // Add an event listener to the delete button that removes the board from the DOM
        deleteBoardBtn.addEventListener('click', function (event) {
            event.preventDefault(); // stops default action
            const boardElement = event.target.closest('.board');
            const boardId = boardElement.dataset.boardId;
            const boardRef = doc(db, 'Boards', boardId);
            console.log('board id', boardRef);
            deleteBoard(boardRef, boardElement);
        });

        addTicketBtn.addEventListener('click', function (event) {
            event.preventDefault();
            const boardElement = event.target.closest('.board');
            const boardId = boardElement.dataset.boardId;
            const boardRef = doc(db, 'Boards', boardId);
            console.log('board id', boardRef);
            const getInfo = document.getElementById('addTicket-form');
            createNewTicket(getInfo, boardId);
        });

        // deleteTicketBtn.addEventListener('click', function (event) {
        //     event.preventDefault();
        //     // get the modal element by its id
        //     const addTicketModal = document.getElementById("modal-deleteTicket");
        //     // set the display property to block to show the modal
        //     addTicketModal.style.display = "block";
        // });

        const ticketList = newBoard.querySelector('#TicketList')
        viewTicketList(ticketList, id)
        



    }


}

function deleteBoard(board, elem) {
    elem.remove();
    deleteDoc(board);
}



//===========================================User Class========================================


class User {
    constructor(userName, email, password, role) {
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.role = role;
    }
    toString() {
        return this.name;
    }
}

// Firestore data converter
const userConverter = {
    toFirestore: (user) => {
        return {
            name: user.userName,
            email: user.email,
            password: user.password,
            role: user.role
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new User(user.userName, user.email, user.password, user.role);
    }
};


//===========================================Create Ticket========================================
function createNewTicket(getInfo, boardId) {

    const boardRef = doc(db, "Boards", boardId);

    getInfo.addEventListener('submit', (e) => {
        e.preventDefault()
        // Create a new ticket object
        const newTicket = {
            title: getInfo.title.value,
            priority: getInfo.priority.value,
            description: getInfo.description.value,
        }
        console.log(newTicket)
        // Add the new ticket to the tickets collection under the board document in Firestore
        addDoc(collection(boardRef, "Tickets"), newTicket)
            .then(() => {
                console.log("Ticket added to Firestore!");
                getInfo.reset()
                const modal = getInfo
                M.Modal.getInstance(modal).close(); // close the modal
            })
            .catch((error) => {
                console.error("Error adding ticket to Firestore: ", error);
            });
    });
}
//================================================================================================





//=======================Create Account==============================
const signupForm = document.querySelector('#signup-form'); // get entire signup form and its contents
if (signupForm) { // if signup form exists on the page
    signupForm.addEventListener('submit', (e) => { // once form is submitted with button press
        e.preventDefault(); // prevents default action
        creatNewAccount() // creates account on firebase

    })
}

function creatNewAccount(){
    //get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    // const role = signupForm['signup-account-type'].value;
    console.log(email, password);

    // Create the user account in Firebase Authentication
    createUserWithEmailAndPassword(auth, email, password).then((cred) => {
        console.log('user just signed up: ', cred); // console will display user that just signed in if worked correctly

        // Add the user's information to Firestore with a unique ID
        const usersRef = collection(db, 'Users');
        
        addDoc(usersRef, {
            // Add user given what was submitted from modal
            email: email,
            password: password
        }).then(() => {
            console.log('User added to Firestore');
        }).catch((error) => {
            console.error('Error adding user to Firestore: ', error);
        });

        signupForm.reset(); // reset signup form delared above
        // window.location.href = "dashboard.html";

    }).catch((error) => {

        // display errors
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode)
        console.log(errorMessage)

        signupForm.reset(); // reset signup form delared above
        // ..
    });

}
//================================================================================================

//=======================CHECK TO SEE IF USER IS SIGNED INTO SITE OR NOT==========================
// listen for auth status changes
onAuthStateChanged(auth, user => {
    if (user) { // If there is a user currently logged in
        console.log('user logged in: ', user);


    } else { // if user is not currently logged in
        console.log('user logged out');
    }
})
//================================================================================================

//=======================CHECK TO SEE IF USER IS SIGNED INTO SITE OR NOT==========================
// function logoutUser(message);
//logout
const logout = document.querySelector('#logout'); // get logout button from nav bar
if (logout) {
    logout.addEventListener('click', (e) => {
        e.preventDefault(); // stops default action
        signOut(auth).then(() => {
        })
    })
}
//================================================================================================

//===========================================SIGN IN==============================================
// function authenticateCredentials(username, password);
//signin
const loginForm = document.querySelector('#login-form') // refrence to login form
if (loginForm) { // if login form exists on current page
    loginForm.addEventListener('submit', (e) => { // when login form is submitted
        e.preventDefault();

        // get info from login form
        const email = loginForm['login-email'].value;
        const password = loginForm['login-password'].value;
        console.log(email, password);

        authenticateCredentials(email, password)
    })
}

function authenticateCredentials(email, password) {
    // sign person in with inputted credentials
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        window.location.href = "dashboard.html"; // function directToDashboard();
        console.log('user login: ', user);
        loginForm.reset(); // reset signup form delared above
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        loginForm.reset(); // reset signup form delared above
    });

}
//================================================================================================



// function logoutUser(message);



// function directToDashboard();

// function getUserDetails();

//===========================================Show Tickets On Site===================================

function viewTicketList(placeToAdd, id) {
    // create refrence to collection
    const colRef = collection(db, 'Boards/' + id + '/Tickets')
    const q = query(colRef, orderBy("priority"));
    // get collection data
    getDocs(q) // getDocs returns a snapshot
        .then((snapshot) => { // when a snapshot is recived
            let tickets = []
            snapshot.docs.forEach(doc => {
                tickets.push({ ...doc.data(), id: doc.id })
            });
            setupTickets(tickets);
        })
        .catch(err => {
            console.log(err.message)
            setupTickets([]);
    })
    const ticketInfo = document.getElementById('ticket-field');
    

    //setup tickets
    const setupTickets = (data) => { // get snapshot
        if (data.length != 0) {
            let html = ""; // blank template to append html
            let ticketHTML ="";
            data.forEach(doc => { // go through snapshot. return each doc as a element
                const ticket = doc // det data from doc
                // create html code with elements from data base
                const li = `              
                <li>
                    <div><button class="view-ticket-details modal-trigger modal-btn"
                    data-target="modal-Ticket">${ticket.title}</button></div>
                    
                </li>
                `;
                const ticketItems =`<h6>${ticket.title}</h6> </br> 
                <h6>${ticket.priority}</h6> </br> 
                <h6>${ticket.description}</h6>
                `;
                html += li; // append each data
                ticketHTML += ticketItems
                //<div class="collapsible-body white">${tickets.description}</div>
            });
            ticketInfo.innerHTML = ticketHTML;
            placeToAdd.innerHTML = html; // add to Html file from abve defined place
            
        } else {
            placeToAdd.innerHTML = '<h5 class ="center-align">THERE ARE NO TICKETS</h5>'
        }
    }
}



//================================================================================================
// function viewTicketDetails(ticket);



// function editTicketDetails(ticket, newDetails);

//===========================================Delete Ticket========================================
// function deleteTicket(ticket);
const DTicketForm = document.querySelector('#deleteTicket-form')
const DTicketModal = document.querySelector('#modal-deleteTicket')

DTicketForm.addEventListener('submit', (e) => {
    e.preventDefault() // stops page from refreshing

    const docRef = doc(db, 'Tickets', DTicketForm.id.value)
    deleteDoc(docRef)
        .then(() => {
            DTicketForm.reset()
        })

})
//================================================================================================
// function changePassword(oldPassword, newPassword);

// function viewProjectList(accountId);

// function viewProjectDetails(projectId);

// function getTicketList(accountId);

// function getTicketDetails(ticketId);

// function updateTicketStatus(ticketId, newStatus);

// function updateTicketPriority(ticketId, newPriority);

// function assignTicketDeveloper(ticketId, accountId);

// function deleteTicket(ticketID);

// function filterTicketListByStatus(ticketList, status);

// filterTicketListByPriority(ticketList, priority);

// function sortTicketListByDate(ticketList, date);

// function getTotalTimeSpent(ticket);



// function sendActivationEmail(); 

// function activateAccount();

