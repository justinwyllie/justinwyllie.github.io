import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';

import {  LABELS } from "./Constants";
import ErrorMessageDisplay from "./Components/Components";
import { CapitalizeFirstLetter } from "./helpers";
import reactStringReplace from './Utilities/react-string-replace-with-index';
import {  Check, X, Plus, Dash} from 'react-bootstrap-icons';
import { Base64 } from 'base64-string';

const DOMAIN = "dev.kazanenglishacademy.com";

const App = () => {

    return <>
        <GapFillExercise></GapFillExercise>
    </>

}

/* TODO
 import vle gap fill and pass it props 
 obtain the needed props by a fetch call in a wrapper so they are up to date
 this app should just wrap gapfill
  get the slug dynamically 
  email the results! (this is one reason to integrate it into the schools google domain.. 
    or they have to sign in with google?)
*/

const GapFillExercise = (props) =>
{
    
    const [exercise, setExercise] = useState(undefined);
    const [meta, setMeta] = useState(undefined);
    const [questionAnswerSets, setQuestionAnswerSets] = useState(undefined);
    const [grammarTags, setGrammarTags] = useState([]);
    const slug = 'superlative-form-of-adjectives'; //get this out of url. 
    const [error, setError] = useState(false);
    const [checkButtonActive, setCheckButtonActive] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const userLang = 'en';
    const grammarTermsKeyed = {
        "81": {
            "description": "Adjectives",
            "count": 4,
            "slug": "adjectives"
        },
        "82": {
            "description": "Tenses",
            "count": 36,
            "slug": "tenses"
        },
        "93": {
            "description": "Present Perfect",
            "count": 19,
            "slug": "present-perfect"
        },
        "95": {
            "description": "Conditionals",
            "count": 10,
            "slug": "conditionals"
        },
        "96": {
            "description": "First Conditional",
            "count": 9,
            "slug": "first-conditional"
        },
        "98": {
            "description": "Zero Conditional",
            "count": 0,
            "slug": "zero-conditional"
        },
        "99": {
            "description": "Third Conditional",
            "count": 2,
            "slug": "third-conditional"
        },
        "100": {
            "description": "Expressing wishes",
            "count": 0,
            "slug": "expressing-wishes"
        },
        "101": {
            "description": "Future Forms",
            "count": 3,
            "slug": "future-forms"
        },
        "102": {
            "description": "Going to",
            "count": 2,
            "slug": "going-to"
        },
        "103": {
            "description": "Future Simple",
            "count": 4,
            "slug": "future-simple"
        },
        "104": {
            "description": "Present Perfect Continuous",
            "count": 11,
            "slug": "present-perfect-continuous"
        },
        "105": {
            "description": "Past Simple",
            "count": 20,
            "slug": "past-simple"
        },
        "106": {
            "description": "Present Continuous",
            "count": 7,
            "slug": "present-continuous"
        },
        "107": {
            "description": "Past Continuous",
            "count": 7,
            "slug": "past-continuous"
        },
        "108": {
            "description": "Present Simple",
            "count": 7,
            "slug": "present-simple"
        },
        "109": {
            "description": "Second Conditional",
            "count": 10,
            "slug": "second-conditional"
        },
        "110": {
            "description": "Passive",
            "count": 2,
            "slug": "passive"
        },
        "111": {
            "description": "Middle Voice",
            "count": 0,
            "slug": "middle-voice"
        },
        "112": {
            "description": "test",
            "count": 0,
            "slug": "test"
        },
        "113": {
            "description": "Articles",
            "count": 1,
            "slug": "articles"
        },
        "114": {
            "description": "Past Perfect",
            "count": 1,
            "slug": "past-perfect"
        },
        "115": {
            "description": "Order of Adjectives",
            "count": 2,
            "slug": "order-of-adjectives"
        },
        "116": {
            "description": "Pronouns",
            "count": 4,
            "slug": "pronouns"
        },
        "117": {
            "description": "Relative Pronouns",
            "count": 3,
            "slug": "relative-pronouns"
        },
        "118": {
            "description": "Modal Verbs",
            "count": 8,
            "slug": "modal-verbs"
        },
        "119": {
            "description": "Relative Clauses",
            "count": 7,
            "slug": "relative-clauses"
        },
        "120": {
            "description": "Adverbs",
            "count": 1,
            "slug": "adverbs"
        },
        "121": {
            "description": "Verb patterns",
            "count": 1,
            "slug": "verb-patterns"
        },
        "122": {
            "description": "Modals of obligation and permission",
            "count": 1,
            "slug": "modals-of-obligation-and-permission"
        },
        "123": {
            "description": "Quantity Words",
            "count": 1,
            "slug": "quantity-words"
        },
        "124": {
            "description": "No and Not",
            "count": 1,
            "slug": "no-and-not"
        },
        "125": {
            "description": "Future Continuous",
            "count": 1,
            "slug": "future-continuous"
        },
        "126": {
            "description": "Future Perfect",
            "count": 1,
            "slug": "future-perfect"
        },
        "127": {
            "description": "Comparative of Adjectives",
            "count": 1,
            "slug": "comparative-of-adjectives"
        },
        "128": {
            "description": "Superlative of Adjectives",
            "count": 1,
            "slug": "superlative-of-adjectives"
        },
        "129": {
            "description": "Dependent Prepositions",
            "count": 6,
            "slug": "dependent-prepositions"
        },
        "130": {
            "description": "Question Forms",
            "count": 1,
            "slug": "question-forms"
        },
        "131": {
            "description": "So and Such",
            "count": 1,
            "slug": "so-and-such"
        },
        "132": {
            "description": "Object Pronouns",
            "count": 2,
            "slug": "object-pronouns"
        },
        "133": {
            "description": "Possessive Pronouns",
            "count": 1,
            "slug": "possessive-pronouns"
        },
        "134": {
            "description": "Prepositions",
            "count": 3,
            "slug": "prepositions"
        },
        "135": {
            "description": "Adverbs of time",
            "count": 1,
            "slug": "adverbs-of-time"
        },
        "136": {
            "description": "Talking about time",
            "count": 1,
            "slug": "talking-about-time"
        },
        "137": {
            "description": "Verbs followed by the Infinitive or -ing",
            "count": 2,
            "slug": "verbs-followed-by-infinitive-or-ing"
        },
        "138": {
            "description": "Talking about purpose",
            "count": 2,
            "slug": "talking-about-purpose"
        },
        "139": {
            "description": "Used to, be used to, get used to",
            "count": 3,
            "slug": "used-to-be-used-to-get-used-to"
        },
        "140": {
            "description": "There is/are",
            "count": 0,
            "slug": "there-is-are"
        },
        "141": {
            "description": "There is - There are",
            "count": 1,
            "slug": "there-is-there-are"
        },
        "142": {
            "description": "Quantifiers",
            "count": 2,
            "slug": "quantifiers"
        },
        "143": {
            "description": "Phrasal Verbs",
            "count": 5,
            "slug": "phrasal-verbs"
        },
        "144": {
            "description": "Negation",
            "count": 0,
            "slug": "negation"
        }
    };

    const getUnLinkedCopy = (obj) =>
    {
        return structuredClone(obj);
    }

   

    const check = () =>
    {
        if ((typeof questionAnswerSets != "undefined") && 
        (Object.keys(questionAnswerSets).length >= 1) ) {
             
                let newQuestionAnswerSets = getUnLinkedCopy(questionAnswerSets);

                
                for (const qNumber in newQuestionAnswerSets)
                {
                    newQuestionAnswerSets[qNumber].status = "correct";
                    newQuestionAnswerSets[qNumber].correctAnswers.forEach( (answer, idx) => {
                        if (newQuestionAnswerSets[qNumber].userAnswers[idx] != answer)
                        {
                            newQuestionAnswerSets[qNumber].status = "incorrect";    
                        }
                    })
                }
                console.log("newQuestionAnswerSets2", newQuestionAnswerSets);
                //for info - rather than wiping it you can modify parts of it:
                //https://bobbyhadz.com/blog/react-update-nested-state-object-property
                setQuestionAnswerSets( 
                        newQuestionAnswerSets
                );


        }
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
                console.log("reset", newQuestionAnswerSets);
                setQuestionAnswerSets( 
                        newQuestionAnswerSets
                );
                setCheckButtonActive(true);
        }
    }

    const handleChange = (e, questionNumber, fieldNumber) =>
    {
        console.log("handleChange", e.currentTarget.value,questionNumber  );
        
        //TODO try to do this with the shallow copy technique. 
        let newQuestionAnswerSets = getUnLinkedCopy(questionAnswerSets);
        newQuestionAnswerSets[questionNumber].userAnswers[fieldNumber] = e.currentTarget.value;
        setQuestionAnswerSets( 
                newQuestionAnswerSets
        );
    }

    const processMeta = (metaData) =>
    {
        const meta = JSON.parse(metaData);
  
        
        let qLength;
        let qaPairs = {};
        console.log("meta",meta );
        meta.questions.forEach((question, idx) => {
            //HACK NEED TO FIX LANG BLOCKS TODO SO THERE IS NO TRAILING | 
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
        setMeta(meta);
    }

    useEffect(() => {
        
        if ((exercise != undefined) && (grammarTermsKeyed != null) && 
            (exercise.grammar_terms.length > 0))
        {
            let tags = [];
            exercise.grammar_terms.forEach((termId) =>
            {   
                tags.push(grammarTermsKeyed[termId].description);
            });
            setGrammarTags(tags);
        }

    },[exercise, grammarTermsKeyed]);    //TODO detect change to userSettings as well...    

    useEffect(() => {
        const enc = new Base64();
        let headers = new Headers(); //browser api?
        headers.set('Authorization', 'Basic ' + enc.encode('dev' + ":" + 'hjgyt65$!H'));
        fetch('//' + DOMAIN + '/wp-json/wp/v2/activity_gap_fills?slug=' + slug + '&data=json',
        {
            method:'GET', 
            headers: headers
        })
            .then(response => response.json())
            .then(data => 
                {
                    processMeta(data[0].meta._activity_gap_fill_meta);
                    //setMeta(meta);
                    setExercise(data[0]);
                }    
        ).catch(function (error) {
            setError(true);
            setErrorMessage(error.message);
        });

        return function cleanUp() {

        }
        
    },[]);    
    
    let questions;
   
    if ((typeof questionAnswerSets != "undefined") && 
    (Object.keys(questionAnswerSets).length >= 1)  )
    {
            let questionsIterable = Object.keys(questionAnswerSets);
            
            questions = questionsIterable.map((question) => {
                return <Question question={questionAnswerSets[question]}  
                    key={question} 
                    handleChange={handleChange} /> 
        });
    }

    let buttons = <Buttons check={check} checkButtonActive={checkButtonActive}
    resetExercise={resetExercise} showCorrectAnswers={showCorrectAnswers} 
    userLang={userLang}></Buttons>;


    return (
        error ? <ErrorMessageDisplay message={errorMessage} />
        : <div>
            <h1>{meta ?  meta.title : ''}</h1>
            <div >
                <div>
                    {/* TODO langs from constants/deployment config - nb also used in language-blocks */}
                    {<Instructions models={meta ? meta.models  : undefined}
                        instructions={meta ? meta.instructions  : undefined} langs={['ru', 'en']} 
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
      
            <div className="grammar-tags mt-3">{grammarTags.map( (tag, idx) => 
                <span className="badge rounded-pill bg-info text-dark" key={idx}>{tag}</span>
            )}</div>
      
        </div>
    )

}

const Buttons = (props) =>
{
  
    const {userLang, check, showCorrectAnswers, resetExercise, checkButtonActive} = props;

    let opts = {};
    if (checkButtonActive == false)
    {
        opts['disabled'] = 'disabled';
    }

    return (
        <div className="mt-3">
            <Button variant="primary" className="me-3" onClick={check} {...opts}>
                {CapitalizeFirstLetter(LABELS[userLang]['check']['infinitive'])}
            </Button>

            <Button variant="primary" className="me-3" onClick={showCorrectAnswers}>
            {CapitalizeFirstLetter(LABELS[userLang]['showCorrectAnswers']['infinitive'])}
            </Button>

            <Button variant="primary" onClick={resetExercise}>
                        {CapitalizeFirstLetter(LABELS[userLang]['reset']['infinitive'])}
            </Button>
        </div>
    )
}

const Question = (props) =>
{
    
    const {question, handleChange} = props;
    

    const getField = (question) =>
    {
        let html;
        if (question.status == "showCorrect")
        {
            html = reactStringReplace(question.question, /(___)/g, (match, i) => 
            {
                return <span key={i} className="correct-answer">{question.correctAnswers[i]}</span>
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

    let html = reactStringReplace(question.question, /(___)/g, (match, i) => 
    {
        return <input  value={question.userAnswers[i]}  key={i} 
        onChange={(e) => handleChange(e, question.questionNumber, i)}   />
    });

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

/*
    @param (array) langs all langs which user has access to 
    @param (string) activeLang user's current choice of site lang. 
        TODO ultimately get this from store and update on change
*/
const Instructions = (props) =>
{
    /* userLang is the global site wide current choice? 
        langs is coded above but will be total available site langs? 
        the supported langs for site must match those for each ex. curr. en and ru. 
    */
    const {instructions, langs, userLang, models} = props;
    const [showModels, setShowModels] = useState(true);

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

                {showModels 
                    ? <Dash  size={36} className="pointer symbols mt-n2" onClick={() => setShowModels(false)}/>
                    : <Plus  size={36} className="pointer symbols mt-n2" onClick={() => setShowModels(true)} />
                }
                
                {showModels && 
                    <p dangerouslySetInnerHTML={modelsText}></p>
                }
            </div>
        </>
    )

}






export {
    App,
    GapFillExercise
}