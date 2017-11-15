'use strict';

$(document).ready(function() {
	var applicationServerPublicKey;

	const pushBtns = $('.pushed');

	let isSubscribed = false;
	let swRegistration = null;

	function urlB64ToUint8Array(base64String) {
	    const padding = '='.repeat((4 - base64String.length % 4) % 4);
	    const base64 = (base64String + padding)
	      .replace(/\-/g, '+')
	      .replace(/_/g, '/');

	    const rawData = window.atob(base64);
	    const outputArray = new Uint8Array(rawData.length);

	    for (let i = 0; i < rawData.length; ++i) {
	      outputArray[i] = rawData.charCodeAt(i);
	    }
	    return outputArray;
	}

	if ('serviceWorker' in navigator && 'PushManager' in window) {
	    console.log('Service Worker and Push is supported');

	    navigator.serviceWorker.register('sw.js')
	    .then(function(swReg) {
	      console.log('Service Worker is registered', swReg);

	      swRegistration = swReg;
	        initialiseUI();
	    })
	    .catch(function(error) {
	      console.error('Service Worker Error', error);
	    });
	  } else {
	    console.warn('Push messaging is not supported');
	}


	function initialiseUI() {
	    pushBtns.click(function(){
	    	subscribeUser();
	    });

	    // Set the initial subscription value
	    swRegistration.pushManager.getSubscription()
	    .then(function(subscription) {
	      isSubscribed = !(subscription === null);
	      console.log('subscription',subscription);

	      if (isSubscribed) {
	        console.log('User IS subscribed.');
	      } else {
	        console.log('User is NOT subscribed.');
	      }
	    });
	}

	function subscribeUser() {

		$.get('/getVapidKey').then(function(res){
		    console.log('vapid key success', res);
		    const applicationServerKey = urlB64ToUint8Array(res.key);
		    console.log('applicationServerKey', applicationServerKey);
		    swRegistration.pushManager.subscribe({
		      userVisibleOnly: true,
		      applicationServerKey: applicationServerKey
		    })
		    .then(function(subscription) {
		      console.log('User is subscribed.');

		      var sub = JSON.parse(JSON.stringify(subscription));
		      
		      $.post('/send-subscription', sub).then(function(res){
		        console.log('sub post success', res);
		      }, function(err){
		        console.log('sub post err', err);
		      });

		      isSubscribed = true;
		    })
		    .catch(function(err) {
		      console.log('Failed to subscribe the user: ', err);
		    });
		  }, function(err){
		    console.log('Failed to subscribe the user [VAPID KEY ERROR] : ', err);
	  	});


	    
	}



});