/*
*
*  Push Notifications codelab
*  Copyright 2015 Google Inc. All rights reserved.
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License
*
*/

/* eslint-env browser, es6 */

'use strict';

$(document).ready(function() {

  // var applicationServerPublicKey;

  // $.get('/getVapidKey').then(function(res){
  //   console.log('vapid key success', res);
  //   applicationServerPublicKey = res.key;
  // }, function(err){
  //   console.log('vapid key err', err);
  // });

  $('.push-init').on('click', function(){

    function getPushCopy(){
      var copy = $('.pushCopy').val(),
      defaultCopy = 'push default message.'

      return copy ? copy : defaultCopy;
    }

    $.post('/trigger-push', {'data':getPushCopy()}).then(function(res){
      console.log('trigger push success', res);
    }, function(err){
      console.log('trigger push err', err);
    });
  });

  // const pushButton = document.querySelector('.js-push-btn');

  // let isSubscribed = false;
  // let swRegistration = null;

  // function urlB64ToUint8Array(base64String) {
  //   const padding = '='.repeat((4 - base64String.length % 4) % 4);
  //   const base64 = (base64String + padding)
  //     .replace(/\-/g, '+')
  //     .replace(/_/g, '/');

  //   const rawData = window.atob(base64);
  //   const outputArray = new Uint8Array(rawData.length);

  //   for (let i = 0; i < rawData.length; ++i) {
  //     outputArray[i] = rawData.charCodeAt(i);
  //   }
  //   return outputArray;
  // }

  // if ('serviceWorker' in navigator && 'PushManager' in window) {
  //   console.log('Service Worker and Push is supported');

  //   navigator.serviceWorker.register('sw.js')
  //   .then(function(swReg) {
  //     console.log('Service Worker is registered', swReg);

  //     swRegistration = swReg;
  //       initialiseUI();
  //   })
  //   .catch(function(error) {
  //     console.error('Service Worker Error', error);
  //   });
  // } else {
  //   console.warn('Push messaging is not supported');
  //   pushButton.textContent = 'Push Not Supported';
  // }

  // function updateBtn() {
  //   if (Notification.permission === 'denied') {
  //     pushButton.textContent = 'Push Messaging Blocked.';
  //     pushButton.disabled = true;
  //     return;
  //   }

  //   if (isSubscribed) {
  //     pushButton.textContent = 'Disable Push Messaging';
  //   } else {
  //     pushButton.textContent = 'Enable Push Messaging';
  //   }

  //   pushButton.disabled = false;
  // }

  // function initialiseUI() {
    // pushButton.addEventListener('click', function() {
    //   pushButton.disabled = true;
    //   if (isSubscribed) {
    //     unsubscribeUser();
    //   } else {
    //     subscribeUser();
    //   }
    // });

  //   // Set the initial subscription value
  //   swRegistration.pushManager.getSubscription()
  //   .then(function(subscription) {
  //     isSubscribed = !(subscription === null);
  //     console.log('subscription',subscription);

  //     if (isSubscribed) {
  //       console.log('User IS subscribed.');
  //     } else {
  //       console.log('User is NOT subscribed.');
  //     }

  //     updateBtn();
  //   });
  // }

  // function subscribeUser() {
  //   const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  //   console.log('applicationServerKey', applicationServerKey);
  //   swRegistration.pushManager.subscribe({
  //     userVisibleOnly: true,
  //     applicationServerKey: applicationServerKey
  //   })
  //   .then(function(subscription) {
  //     console.log('User is subscribed.');

  //     var sub = JSON.parse(JSON.stringify(subscription));
      
  //     $.post('/send-subscription', sub).then(function(res){
  //       console.log('sub post success', res);
  //     }, function(err){
  //       console.log('sub post err', err);
  //     });

  //     isSubscribed = true;

  //     updateBtn();
  //   })
  //   .catch(function(err) {
  //     console.log('Failed to subscribe the user: ', err);
  //     updateBtn();
  //   });
  // }

  // function unsubscribeUser() {
  //   swRegistration.pushManager.getSubscription()
  //   .then(function(subscription) {
  //     if (subscription) {
  //       return subscription.unsubscribe();
  //     }
  //   })
  //   .catch(function(error) {
  //     console.log('Error unsubscribing', error);
  //   }).then(function() {

  //     console.log('User is unsubscribed.');
  //     isSubscribed = false;

  //     updateBtn();
  //   });
  // }
});

