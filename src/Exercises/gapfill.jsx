import React, { useState, useEffect } from "react";
import * as jose from "jose";
window.decodeJwt = jose.decodeJwt;
import { Base64 } from 'base64-string';

import {  LABELS, RESULTSPATH, DOMAIN, MODE, SHOWLOGIN } from "../Constants";

import { CapitalizeFirstLetter } from "./shared-components";




import { Instructions, GapFillQuestion,  Buttons, ErrorMessageDisplay, ConfirmMessageDisplay} from './components';
import { StopHacking } from './shared-components';
import { Login } from '../Account/Login';




const GapFillExercise = (props) =>
{
    
    //const [exercise, setExercise] = useState(undefined);
    const [questionAnswerSets, setQuestionAnswerSets] = useState(undefined);
    const [grammarTags, setGrammarTags] = useState([]);
    const [error, setError] = useState(false);
    const [checkButtonActive, setCheckButtonActive] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [confirmMessage, setConfirmMessage] = useState(undefined);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [hacker, setHacker] = useState(false);
   
    const userLang = 'en';
    const loc = window.location;
    const [fieldState, setFieldState] = useState("is-valid");
  
   
    //const [exercise, setExercise] = useState(props.exercise ? props.exercise : undefined);
    

    useEffect(() => {
        
        if (SHOWLOGIN)
        {
            Login(setUserName, setUserEmail);
        }
        
        
    }, []);   





    const produceQASets = (exercise) =>
    {
        
        let qLength;
        let qaPairs = {};
      
        exercise.questions.forEach((question, idx) => {
            
            let answer = question.answer.replace(/\|$/, '');
        
            const correctAnswers = answer.split('|');
            
            qLength = correctAnswers.length;
           
            var userAnswers = new Array();
            for (let i = 0; i < qLength; i++)
            {
                userAnswers.push('');
            }
            
           
            qaPairs[question.questionNumber] = {
                questionNumber: question.questionNumber,
                question: question.question,
                userAnswers:  userAnswers,
                correctAnswers: correctAnswers,
                status: "unmarked",
                length: qLength
            }
            
        })
 
        setQuestionAnswerSets(qaPairs);
       
    }
    
    const getUnLinkedCopy = (obj) =>
    {
        return structuredClone(obj);
    }

    const feedback = (results) =>
    {
        
        console.log("results", results, userLang);
        
      

        let message = "";
        if (results.scorePercent >= 90)
        {
            message = CapitalizeFirstLetter(LABELS[userLang]['congratulations']['infinitive']);
        }
        else if (results.scorePercent > 65)
        {
            message = CapitalizeFirstLetter(LABELS[userLang]['welldone']['infinitive']);
        }
        else
        {
            message = CapitalizeFirstLetter(LABELS[userLang]['keeptrying']['infinitive']);
        }

        message = CapitalizeFirstLetter(LABELS[userLang]['youscored']['infinitive']) + ": " + results.scorePercent +
            CapitalizeFirstLetter(LABELS[userLang]['percentsign']['nominative']) + ". " + message + ".";

        setConfirmMessage(message);
    }

    //TODO duped in MC
    const reportResult = (questionsAndStudentAnswers) =>
    {

        let headers = new Headers(); //browser api?
        /*
        if (MODE == 'dev')
        {
            const enc = new Base64();
            
            headers.set('Authorization', 'Basic ' + enc.encode('dev' + ":" + 'hjgyt65$!H')); 
            
            //preflight does not send creds so need to fix server not to require creds for OPTIONS 
            //did this use an If - request check to only check for creds if not options
        }
        */
        
        headers.set('Content-Type', 'application/json; charset=UTF-8');
        //needed for Express to grasp that it is an Ajax request
        headers.set('X-Requested-With', 'XMLHttpRequest');

        let results  = {};
        results.mode = props.exercise.mode;
        console.log("questionsAndStudentAnswers", questionsAndStudentAnswers);
        results.answers = {"questionsAndStudentAnswers" : questionsAndStudentAnswers};
        results.slug = props.slug;
        results.name = userName;
        results.email = userEmail;
        results.post_id = props.exercise.post_id;
        results.title = props.exercise.title;
        results.ex_key = props.exKey;
       
        
        fetch("https://" + RESULTSPATH + "/json/results",
        {
            method:'POST',
            headers: headers,
            body: JSON.stringify(results)
            
        })
            .then(response => {
                if (response.ok)
                {
                    return response.json();
                }
                
                throw new Error();
                
            })
            .then(data => 
                {
                    //TODO here work out exercise type. 
                    if (data.success)
                    {
                        //TODO confirm sent 
                        setConfirmMessage(data.message);
                        document.body.scrollTop = document.documentElement.scrollTop = 0;
                    }
                    else
                    {
                        throw new Error(data.message);
                    }
                }).catch((error) => {
                        setError(true);
                        setErrorMessage(error.message);
                    });

    }

    const check = () =>
    {
        if (userName == "")
        {
            setFieldState("is-invalid");
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            return;
        }
        /*
        * if mode is without key what is different?
        * we cannot calculate a score or produce a list of errors
        * nothing should be marked as incorrect or correct
        *
        */
        const mode = props.exercise.mode;
        console.log("mode", mode);
        
        let scorePoss = 0;
        let scoreMistakes = 0;
        let errors = [];

        if ((typeof questionAnswerSets != "undefined") && 
        (Object.keys(questionAnswerSets).length >= 1) ) {
             
                
            let newQuestionAnswerSets;
            if (mode == "withkey")
            {
                newQuestionAnswerSets = getUnLinkedCopy(questionAnswerSets);
                for (const qNumber in newQuestionAnswerSets)
                {
                    newQuestionAnswerSets[qNumber].status = "correct";
                    newQuestionAnswerSets[qNumber].correctAnswers.forEach( (answer, idx) => {
                        scorePoss++;
                        const answerVariations = answer.split(":");
                        if (!answerVariations.includes(newQuestionAnswerSets[qNumber].userAnswers[idx]))
                        {
                            newQuestionAnswerSets[qNumber].status = "incorrect";  
                            scoreMistakes++;  
                        }
                    });
                    if (newQuestionAnswerSets[qNumber].status == "incorrect")
                    {
                        errors.push(qNumber);
                    }
                }
                //for info - rather than wiping it you can modify parts of it:
                //https://bobbyhadz.com/blog/react-update-nested-state-object-property
                setQuestionAnswerSets( 
                    newQuestionAnswerSets
                );
            }   
            

            let questionsAndStudentAnswers;
            let score;
            if (newQuestionAnswerSets == undefined)
            {
                questionsAndStudentAnswers = questionAnswerSets;
                score = null;
            }
            else
            {
                questionsAndStudentAnswers = newQuestionAnswerSets;
                score = (scorePoss - scoreMistakes)  + " out of " +  scorePoss; //TODO out of 
            }
            

            
            
            if (mode == "withoutkey")
            {
                reportResult(questionsAndStudentAnswers);
            }
            else
            {
                let results = {
                    scorePercent: Math.round(((scorePoss - scoreMistakes)  / scorePoss * 100)),
                    score: score,
                    errors: errors,
                    questionsAndStudentAnswers: questionsAndStudentAnswers
                }
                feedback(results);
            }
        }
    }

  
    const submitAnswers = () =>
    {
        
        check();
    
    }
  

    const showCorrectAnswers = () =>
    {
        
        if ( (typeof questionAnswerSets != "undefined")  && 
        (Object.keys(questionAnswerSets).length >= 1)  ) {

                let newQuestionAnswerSets = getUnLinkedCopy(questionAnswerSets);

                for (const qNumber in newQuestionAnswerSets)
                {
                    newQuestionAnswerSets[qNumber].status = "showCorrect";
                }

                setQuestionAnswerSets( 
                        newQuestionAnswerSets
                );
                setCheckButtonActive(false);
        }
             
    }

    const resetExercise = () =>
    {
        if ( (typeof questionAnswerSets != "undefined") && 
             (Object.keys(questionAnswerSets).length >= 1) ) {

                let newQuestionAnswerSets = getUnLinkedCopy(questionAnswerSets);

                
                for (const qNumber in newQuestionAnswerSets)
                {
                    newQuestionAnswerSets[qNumber].status = "unmarked";
                    newQuestionAnswerSets[qNumber].userAnswers.forEach( (answer, idx) => {
                        newQuestionAnswerSets[qNumber].userAnswers[idx] = "";
                    })
                }
                setQuestionAnswerSets( 
                        newQuestionAnswerSets
                );
                setCheckButtonActive(true);
                setConfirmMessage(undefined);
        }
    }

    const setUserNameWrapper = (name) =>
    {

        if (name.length > 30)
        {
            setHacker(true);
            name = name.substr(0, 30);
        }
        else
        {
            setHacker(false);
        }

        if (name != '')
        {
            setFieldState("is-valid");
        }
        setUserName(name);
    }

    const handleChange = (e, questionNumber, fieldNumber) =>
    {
        
       
       /* this is the old version which replaces the object completely 
       
        let newQuestionAnswerSets = getUnLinkedCopy(questionAnswerSets);
        newQuestionAnswerSets[questionNumber].userAnswers[fieldNumber] = e.currentTarget.value;
        setQuestionAnswerSets( 
                newQuestionAnswerSets
        );
            */ 
        
           
        /* TODO - the main problem is a chnage to any question causes all questions to be rerendered.
            how to solve this?
            

             https://alexsidorenko.com/blog/react-update-nested-state/ interesting? 

             for ref: 
             qaPairs[question.questionNumber] = {
                questionNumber: question.questionNumber,
                question: question.question,
                userAnswers:  userAnswers,
                correctAnswers: correctAnswers,
                status: "unmarked",
                length: qLength
            }

            this is an attempt, not working, to do the array update in place
            https://stackoverflow.com/questions/76756681/react-how-to-update-a-nested-object-when-the-keys-are-variables
             
            userAnswers : [...prevState[questionNumber].userAnswers.slice(0, fieldNumber), e.currentTarget.value, 
                    ...prevState[questionNumber].userAnswers.slice(fieldNumber + 1, 
                        prevState[questionNumber].userAnswers.length)]
                }
             */

    
        let newUserAnswers = questionAnswerSets[questionNumber].userAnswers.map( (val, idx) => {
            if (idx == fieldNumber) 
            {
                return e.currentTarget.value;
            }
            else
            {
                return val;
            }
        });
   

        /* this actually works - see SO post. But I prefer the readability of the map
        let newVal = e.currentTarget.value;
        [...prevState[questionNumber].userAnswers.slice(0, fieldNumber), newVal, 
                    ...prevState[questionNumber].userAnswers.slice(fieldNumber + 1, 
                        prevState[questionNumber].userAnswers.length)]
                
        */
        

        setQuestionAnswerSets((prevState) => { 
                return {...prevState,
                    [questionNumber] : {
                    ...prevState[questionNumber],
                    userAnswers : newUserAnswers
                    }
                }
       });
       
           
        

    }

    

    useEffect(() => {

        setGrammarTags(props.exercise.labels); //TDDO - test empty array case
        produceQASets(props.exercise);
       
        
        
    },[props.exercise]);   


    
    let questions;
    const exercise = props.exercise;

   
    if ((typeof questionAnswerSets != "undefined") && 
    (Object.keys(questionAnswerSets).length >= 1)  )
    {
            let questionsIterable = Object.keys(questionAnswerSets);
            
            questions = questionsIterable.map((question) => {
                return <GapFillQuestion question={questionAnswerSets[question]}  
                    key={question} 
                    handleChange={handleChange} /> 
        });
    }

    let buttons = <Buttons check={check} checkButtonActive={checkButtonActive}
        resetExercise={resetExercise} showCorrectAnswers={showCorrectAnswers} 
        userLang={userLang}
        mode={exercise.mode}
        submitAnswers={submitAnswers}></Buttons>;

    let message = '';
    if (hacker)
    {
        message = <StopHacking />
    }
    let confirmMessageDisplay = '';
    if (confirmMessage != undefined)
    {
        confirmMessageDisplay = <ConfirmMessageDisplay message={confirmMessage} />
    }


    

    return (
        error ? <ErrorMessageDisplay message={errorMessage} /> 
        : <div >
            <h1 className="text-center">{exercise ?  exercise.title : ''}</h1>

             {message}  
             {confirmMessageDisplay} 
             
            
            <div className="mt-3 mb-3 input-group has-validation">
            <label htmlFor="userName" className="form-label me-2">Name  </label> 
            <input id="userName" maxLength="30"  className={fieldState} value={userName} onChange={(e) =>
                       setUserNameWrapper(e.currentTarget.value)}   />
                <div className="invalid-feedback">
                    Please enter your name
                </div>
            </div>
            

            <div >
                <div>
                    {/* TODO langs from constants/deployment config - nb also used in language-blocks */}
                    {<Instructions models={exercise ? exercise.models  : undefined}
                        explanation={exercise ? exercise.explanation  : undefined}
                        instructions={exercise ? exercise.instructions  : undefined} langs={['ru', 'en']} 
                        userLang={userLang}  />}
                </div>
                
                <div className="mt-3">
                    <h4>
                        {CapitalizeFirstLetter(LABELS[userLang]['questions']['nominative'])}:
                    </h4>
                    <div>
                        {questions}
                    </div>
                    <div>
                        {buttons}
                    </div>
                     
                </div>
            </div>  
      
            <div className="grammar-tags mt-3 pb-3">{grammarTags.map( (tag, idx) => 
                <span className="badge rounded-pill bg-info text-dark" key={idx}>{tag}</span>
            )}</div>
            
        </div>
    )

}

export {
    GapFillExercise
}