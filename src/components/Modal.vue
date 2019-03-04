<template>
<transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">Welcome!</slot>
          </div>
          <div class="modal-body">
            <slot name="body">This chart demonstrates the cashflow to and from a selected address. 
            <br>Line thickness represents the probability that the funds came from or went to a certain address. 
            <br>{{ decoder('\u27F6') }} Incoming connections are on the left, outgoing {{ decoder('\u27F6') }}
            
            </slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
                Have fun!   
                </slot>
            <button class="modal-button" @click="$emit('close')" style="cursor:pointer">Got it!</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
    methods: {
        decoder (str) {
            var textArea = document.createElement('textarea');
            textArea.innerHTML = str;
            return textArea.value;
        }
    }
}
</script>
<style>
.modal-button{
  width: 105px;
  height: 40px;
  background: #FFD66E;
  border-radius: 4px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  align-self:flex-end;
  font-size: 14px;
  font-weight:600;
  border: none;
  margin-left: 10px;
}

.modal-button:hover{
  background: #f9c43e;
  transition: .2s ease-in-out;
  cursor: pointer;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 500px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;

}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

</style>