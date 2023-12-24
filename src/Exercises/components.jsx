import React, { useState } from "react";
import { CapitalizeFirstLetter } from "../helpers";
import { LABELS } from '../Constants';
import { Button } from 'react-bootstrap';
import {  Check, X, Plus, Dash } from 'react-bootstrap-icons';
import reactStringReplace from '../Utilities/react-string-replace-with-index';

import Form from 'react-bootstrap/Form'; 



//TODO TRANSLATION!
 const ErrorMessageDisplay = (props) => {

    return (
        <p variant="danger" className="space-above-below"  >
            Sorry. An error has occurred. There may be further information here: {props.message}
        </p>
    )

}



const ConfirmMessageDisplay = (props) => {

    let status;
    if (!props.status)
    {
        status = "success";
    }
    else
    {   
        status = props.status;
    }
   
    return (
        <div className={`alert alert-${status}`} role="alert">
            {props.message}
        </div>
    )

}

const Buttons = (props) =>
{
  
    const {userLang, check, showCorrectAnswers, resetExercise, checkButtonActive, mode, submitAnswers} = props;

    let opts = {};
    if (checkButtonActive == false)
    {
        opts['disabled'] = 'disabled';
    }

    return (
        <div className="mt-3">
            {mode == 'withkey' ?
                <Button variant="primary" className="me-3" onClick={check} {...opts}>
                    {CapitalizeFirstLetter(LABELS[userLang]['check']['infinitive'])}
                </Button> : ''
            }

            {mode == 'withkey' ?
                <Button variant="primary" className="me-3" onClick={showCorrectAnswers}>
                {CapitalizeFirstLetter(LABELS[userLang]['showCorrectAnswers']['infinitive'])}
                </Button> : ''
            }

            {mode == 'withoutkey' ?
                <Button variant="primary" className="me-3" onClick={submitAnswers}>
                {CapitalizeFirstLetter(LABELS[userLang]['submitformarking']['infinitive'])}
                </Button> : ''
            }

            <Button variant="primary" onClick={resetExercise}>
                        {CapitalizeFirstLetter(LABELS[userLang]['reset']['infinitive'])}
            </Button>
        </div>
    )
}

const Instructions = (props) =>
{
    /* userLang is the global site wide current choice? 
        langs is coded above but will be total available site langs? 
        the supported langs for site must match those for each ex. curr. en and ru. 
    */
    const {instructions, langs, userLang, models, explanation} = props;
    const [showModels, setShowModels] = useState(true);
    const [showExplanation, setShowExplanation] = useState(false);

    let availableLangsWithFlag = [];
    langs.forEach(lang => {
        let langObj = {
            lang: lang,
            active: false
        }
        if (lang == userLang)
        {
            langObj.active = true;
        }
        availableLangsWithFlag.push(langObj);

    });

    const [activeUserLang, setActiveUserLang] = useState(userLang);
    const [availableLangs, setAvailableLangs] = useState(availableLangsWithFlag);

    const flags = availableLangs.map(function(langObj, i) {
        let flagLang;
        if (langObj.lang == "en")
        {
            flagLang = "gb" ;
        }
        else
        {
            flagLang = langObj.lang;   
        }
        return <span key={i}>
            <span  onClick={() => setActiveLang(langObj.lang)} 
                className={langObj.active ? `pointer selected-lang me-1 fp ${flagLang} ` 
                    : `pointer me-1 fp ${flagLang} `}>
                
            </span>
            
            </span>
        
    });

   

    const setActiveLang = (lang) =>
    {
        let availableLangsCopy = [...availableLangs];
        availableLangsCopy.forEach(langObj => {
            if (langObj.lang == lang)
            {
                langObj.active = true;
            }
            else
            {
                langObj.active = false;    
            }
        });
        setActiveUserLang(lang);
        setAvailableLangs(availableLangsCopy);
    }

   

    let modelsText = {__html: ''};
  
    if (models != undefined && models != "")
    {
        modelsText.__html = models;
    }

    let explanationText = {__html: ''};
  
    let explanationBlock = '';
    if (explanation != undefined && explanation != "")
    {
        explanationText.__html = explanation;
        explanationBlock = 
        <div className="mt-3">
            <h4 className=" d-inline">
                    {CapitalizeFirstLetter(LABELS[userLang]['explanation']['nominative'])}
                
            </h4>

            {showExplanation 
                ? <Dash  size={36} className="pointer symbols mt-n2" onClick={() => setShowExplanation(false)}/>
                : <Plus  size={36} className="pointer symbols mt-n2" onClick={() => setShowExplanation(true)} />
            }
            
            {showExplanation && 
                <p dangerouslySetInnerHTML={explanationText}></p>
            }
        </div>
    }

    

    

    return (
        <>
          
            <h4>
                {CapitalizeFirstLetter(LABELS[userLang]['instructions']['nominative'])}:
            </h4>
            <div>
                {flags}
            </div>
            
            <div>
                {instructions ? instructions[activeUserLang] : ''}
            </div>
            <div className="mt-3">
                <h4 className=" d-inline">
                    {CapitalizeFirstLetter(LABELS[userLang]['models']['nominative'])}
                
                </h4>
s
                {showModels 
                    ? <Dash  size={36} className="pointer symbols mt-n2" onClick={() => setShowModels(false)}/>
                    : <Plus  size={36} className="pointer symbols mt-n2" onClick={() => setShowModels(true)} />
                }
                
                {showModels && 
                    <p dangerouslySetInnerHTML={modelsText}></p>
                }

                {explanationBlock}

            </div>
        </>
    )

}

const GapFillQuestion = (props) =>
{
    
    const {question, handleChange} = props;
 
    

    const getField = (question) =>
    {
        let html;
        if (question.status == "showCorrect")
        {
            html = reactStringReplace(question.question, /(___)/g, (match, i) => 
            {
                const answerVariants = question.correctAnswers[i].split(":");
                return <span key={i} className="correct-answer">{answerVariants[0]}</span>
            })
        }
        else
        {
            
            html = reactStringReplace(question.question, /(___)/g, (match, i) => 
            {
                return <input value={question.userAnswers[i]}  key={i} onChange={(e) =>
                        handleChange(e, question.questionNumber, i)}   />
            })
        }
        
        return html;
    }
    
    

    let feedback;
    
    if (question.status == "correct")
    {
        feedback = <Check color="green" size={24} />;
    }
    else if (question.status == "incorrect")
    {
        feedback = <X color="red" size={24} />;
    }
    else
    {
        feedback = <span></span>;
    }

    /*
    let html = reactStringReplace(question.question, /(___)/g, (match, i) => 
    {
        return <input  value={question.userAnswers[i]}  key={i} 
        onChange={(e) => handleChange(e, question.questionNumber, i)}   />
    });
    */

    return (
        <div className="exercise-question unmarked mt-3">
            {question.questionNumber}.<span> </span>
            {
                getField(question)
            }
            {feedback}
             
        </div>
    )
}


const MultipleChoiceQuestion = (props) =>
{
    
    const {question, handleChange} = props;
 
    const getRadioGroup = (question) =>
    {

    
        //TODO is it ok to use i as key
        let options = question.options.map((answer, i) => {
            let status;
            let checkedState = false;
            
            if (question.status == "showCorrect")
            {
                if (question.correctAnswer == i)
                {
                    status = "is-valid show-correct";
                }
            }
            else if (question.status != "unmarked")  /* will be correct or incorrect but here we need to be specific about which input */
            {
                if ((question.userAnswer == i) && (question.userAnswer == question.correctAnswer))
                {
                    status = "is-valid";
                }
                else if ((question.userAnswer == i) && (question.userAnswer != question.correctAnswer))
                {
                    status = "is-invalid";
                }
            }

            if (question.status != "showCorrect")
            {
                if (question.userAnswer == i)
                {
                    checkedState = true;
                }
            }
           
            
            return <div className="mb-3" key={`q-radio-${i}`} >
                <Form.Check key={i} type="radio" >
                        <Form.Check.Input type="radio"  checked={checkedState}  className={status} name={`group-${question.questionNumber}`} onChange={(e) =>
                                    handleChange(e, question.questionNumber, i)}  />
                        <Form.Check.Label >{answer}</Form.Check.Label>
                        
            </Form.Check></div>;
        });

    
       
        let radioGroup = <div>
            {options}
        </div>;
     
        return radioGroup;
    }
    
    /* <Form.Control.Feedback type="valid">
                                You did it!
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                                You didn't do it!
                            </Form.Control.Feedback> */

    let feedback;
    
    if (question.status == "correct")
    {
        feedback = <Check color="green" size={24} />;
    }
    else if (question.status == "incorrect")
    {
        feedback = <X color="red" size={24} />;
    }
    else
    {
        feedback = <span></span>;
    }

    /*
    let html = reactStringReplace(question.question, /(___)/g, (match, i) => 
    {
        return <input  value={question.userAnswers[i]}  key={i} 
        onChange={(e) => handleChange(e, question.questionNumber, i)}   />
    });
    */

    return (
        <div className="unmarked mt-3">
            <div className="mb-3">{`${question.questionNumber}. ${question.question}`} {feedback}</div>
            {
                getRadioGroup(question)
            }
            
             
        </div>
    )
}

const Google = () =>
{
    return(<>
        <div id="buttonDiv"></div>

        <div id="g_id_onload"
            data-client_id="440488237448-1r2t7lo5bgb4nv46sg505h55ebg0bcoj.apps.googleusercontent.com"
            data-context="signin"
            data-ux_mode="popup"
            data-callback="handleLogin"
            data-itp_support="true">
        </div>

        <div class="g_id_signin"
            data-type="standard"
            data-shape="rectangular"
            data-theme="outline"
            data-text="signin_with"
            data-size="large"
            data-logo_alignment="left">
        </div>
    </>)
}


export {

    ErrorMessageDisplay,
    ConfirmMessageDisplay,
    Buttons,
    Instructions,
    GapFillQuestion,
    MultipleChoiceQuestion
  
}