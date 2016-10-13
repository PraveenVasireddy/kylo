/*
 * Copyright (c) 2016.
 */

/**
 *
 */
angular.module(MODULE_FEED_MGR).service('StepperService', function ($rootScope, $http) {

    var self = this;
    /**
     * subscribers of this event will get the following data passed to them
     * current  - number datatype
     * @type {string}
     */
    this.ACTIVE_STEP_EVENT = 'ACTIVE_STEP_EVENT';
    /**
     * subscribers of this event will get the following data passed to them:
     * {newStep:current,oldStep:old}
     * newStep - number datatype
     * oldStep - number datatype
     * @type {string}
     */
    this.STEP_CHANGED_EVENT = 'STEP_CHANGED_EVENT';

    this.steppers = {};
    this.newNameIndex = 0;
    this.registerStepper = function(name,totalSteps){
        var steps = [];
        self.steppers[name] = steps;
        var lastIndex = totalSteps -1;
        var disabled = false;
        for(var i=0;i<totalSteps; i++){
            if(i >0){
                disabled = true;
            }

           steps[i]= {disabled:disabled, active:true,number:(i+1),index:i, icon:'number'+(i+1),iconSize:30,nextActiveStepIndex:(i!=lastIndex) ? (i+1) : null, previousActiveStepIndex:(i !=0) ? i-1 : null,visited:false, complete:false, updateStepType:function() {
               if(this.complete == true && this.visited == true && this.active && !this.disabled){
                   this.type = 'step-complete';
                   this.icon = 'check'
                   this.iconSize = 20;
                   this.iconStyle = '#F08C38';
               }
               else {
                   this.type = 'step-default';
                   this.icon = 'number'+(this.number);
                   this.iconSize = 30;
                   this.iconStyle= '';
               }
           }, reset:function() {
               this.complete = false;
               this.visited = false;
               this.updateStepType();
           }};
        }
    }
    this.deRegisterStepper = function(name){
        delete self.steppers[name];
    }
    this.newStepperName = function(){
        self.newNameIndex++;
        return 'stepper_'+self.newNameIndex;
    }
    this.getStep = function(stepperName,index){
        if(typeof index == 'string') {
            index = parseInt(index);
        }
        var steps = self.steppers[stepperName];
        if(steps != null && steps.length >0)
        {
            if(index != null && index >=0 && index <steps.length) {
            return steps[index]
         }

        }
        return null;
    }
    this.getSteps = function(stepper){
        return this.steppers[stepper];
    }

    this.updatePreviousNextActiveStepIndexes = function(stepper){
        var steps = self.steppers[stepper];
        if(steps != null && steps.length >0)
        {
            for(var i=0; i<steps.length; i++){
                var step = steps[i];
                var previousActiveStep = self.previousActiveStep(stepper,i);
                if(previousActiveStep != null) {
                    step.previousActiveStepIndex = previousActiveStep.index;
                }
                else {
                    step.previousActiveStepIndex = null;
                }

                var nextActiveStep = self.nextActiveStep(stepper,i);
                if(nextActiveStep != null) {
                    step.nextActiveStepIndex = nextActiveStep.index;
                }
                else {
                    step.nextActiveStepIndex = null;
                }
            }
        }
    }

    this.deactivateStep = function(stepper,index){
       var step = self.getStep(stepper,index);
        if(step != null){
            step.active = false;
            step.disabled = true;
            self.updatePreviousNextActiveStepIndexes(stepper,index);
        }
    }

    this.activateStep = function(stepper,index){
        var step = self.getStep(stepper,index);
         if(step != null){
            step.active = true;
            self.updatePreviousNextActiveStepIndexes(stepper,index);
        }
    }

    this.stepDisabled = function(stepper,index) {
        var step = self.getStep(stepper,index);
        if(step != null){
            step.disabled = true;
        }

    }
    this.stepEnabled = function(stepper,index) {
        var step = self.getStep(stepper,index);
        if(step != null && step.active) {
            step.disabled = false;
        }

    }

    this.arePreviousStepsComplete = function(index) {
        var complete= false;
        for(var i=0; i<index; i++) {
            var step = self.steps[i];
            if(step.active && step.complete && step.visited){
                complete = true;
                break;
            }
        }
        return complete;
    }

    this.arePreviousStepsVisited = function(index) {
        var complete= false;
        for(var i=0; i<index; i++) {
            var step = self.steps[i];
            if(step.active && step.visited){
                complete = true;
                break;
            }
        }
        return complete;
    }


    this.arePreviousStepsDisabled = function(index) {
        var disabled= false;
        for(var i=0; i<index; i++) {
            var step = self.steps[i];
            if(step.disabled){
                disabled = true;
                break;
            }
        }
        return disabled;
    }

    this.previousActiveStep = function(stepperName,index){
        var previousIndex = index-1;
        var previousEnabledStep = null;
        var previousEnabledStepIndex = null;
        if(previousIndex>=0) {
            var steps = self.steppers[stepperName];
            for(var i=previousIndex; i>=0; i--) {
                var step = steps[i];
                if(step.active){
                    previousEnabledStep = step;
                    previousEnabledStepIndex = i;
                    break;
                }
            }
            return previousEnabledStep;
        }
        else {
            return null;
        }
    }

    this.nextActiveStep = function(stepperName,index){
        var nextIndex = index+1;
        var nextEnabledStep = null;
        var nextEnabledStepIndex = null;
        var steps = self.steppers[stepperName];
        if(nextIndex <steps.length) {
            for(var i=nextIndex; i<steps.length; i++) {
                var step = steps[i];
                if(step.active){
                    nextEnabledStep = step;
                    nextEnabledStepIndex = i;
                    break;
                }
            }
            return nextEnabledStep;
        }
        else {
            return null;
        }

    }


});