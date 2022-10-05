/* eslint-disable */
import {
  Component,
  ElementRef,
  ViewChild,
  SimpleChanges,
  NgZone,
  ChangeDetectorRef,
  Output,
  Input,
  AfterViewInit,
  OnInit,
  OnChanges,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SupplierHttpService } from 'src/app/core/services/supplierHttp.service';

//
// Ref: https://github.com/bcgov/MyGovBC-CAPTCHA-Widget
//

export const SupportedLanguages = [
  ['zh', 'Chinese'],
  ['en', 'English'],
  ['fr', 'French'],
  ['pa', 'Punjabi'],
];

// 7 mutually exclusive states
// the program can only be in one of these states at any given point
enum CAPTCHA_STATE {
  FETCHING_CAPTCHA_IMG = 1,
  SUCCESS_FETCH_IMG = 2,
  ERROR_FETCH_IMG = 3,
  VERIFYING_ANSWER = 4,
  SUCCESS_VERIFY_ANSWER_CORRECT = 5,
  ERROR_VERIFY = 6,
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.scss'],
})
export class CaptchaComponent
  implements AfterViewInit, OnInit, OnChanges, OnDestroy
{
  @ViewChild('image') imageContainer: ElementRef;
  @ViewChild('audioElement') audioElement: ElementRef;

  @Input() nonce = 'EMBC ESS Captcha'; // FUTURE: use this for authentication
  @Input() language = 'en';
  @Input() successMessage: string;
  @Input() eagerFetchAudio = false;
  @Input() userPromptMessage: string;
  @Output() validToken = new EventEmitter<string>();
  @Output() serverError = new EventEmitter<any>();

  readonly translatedMessages = {
    playAudio: {
      en: 'Play Audio',
      zh: '播放声音',
      fr: 'Lecture audio',
      pa: 'ਆਡੀਓ ਚਲਾਓ',
    },
    tryAnotherImg: {
      en: 'Try another image',
      zh: '换个图像',
      fr: 'Essayez une autre image',
      pa: 'ਕੋਈ ਹੋਰ ਚਿੱਤਰ ਅਜ਼ਮਾਓ',
    },
    userPromptMessage: {
      en: 'Enter the text you either see in the box or you hear in the audio',
      zh: '请输入看到或听到的文字',
      fr: 'Entrez le texte que vous voyez dans la case ou que vous entendez dans le son',
      pa: 'ਉਹ ਟੈਕਸਟ ਦਾਖਲ ਕਰੋ ਜੋ ਤੁਸੀਂ ਬਕਸੇ ਵਿੱਚ ਦੇਖਦੇ ਹੋ ਜਾਂ ਤੁਸੀਂ ਆਡੀਓ ਵਿੱਚ ਸੁਣਦੇ ਹੋ',
    },
    incorrectAnswer: {
      en: 'Incorrect answer, please try again.',
      zh: '答案不对。请重试。',
      fr: 'Mauvaise réponse, veuillez réessayer.',
      pa: 'ਗਲਤ ਜਵਾਬ, ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ.',
    },
    successMessage: {
      en: 'You can submit your application now.',
      zh: '你现在可以提交申请了。',
      fr: 'Vous pouvez soumettre votre candidature maintenant.',
      pa: 'ਤੁਸੀਂ ਆਪਣੀ ਅਰਜ਼ੀ ਹੁਣੇ ਪੇਸ਼ ਕਰ ਸਕਦੇ ਹੋ',
    },
    correct: {
      en: 'Correct.',
      zh: '正确。',
      fr: 'Correct.',
      pa: 'ਸਹੀ ਕਰੋ',
    },
    loadingImage: {
      en: 'Loading CAPTCHA image',
      zh: '正在下载验证码',
      fr: "Chargement de l'image CAPTCHA",
      pa: 'ਕੈਪਟਚਾ ਚਿੱਤਰ ਲੋਡ ਕਰ ਰਿਹਾ ਹੈ',
    },
    browserNotSupportAudio: {
      en: 'Your browser does not support the audio element.',
      zh: '你的浏览器不支持播音',
      fr: "Votre navigateur ne supporte pas l'élément audio.",
      pa: 'ਤੁਹਾਡਾ ਬ੍ਰਾਉਜ਼ਰ ਆਡੀਓ ਐਲੀਮੈਂਟ ਦਾ ਸਮਰਥਨ ਨਹੀਂ ਕਰਦਾ.',
    },
    verifyingAnswer: {
      en: 'Verifying your answer...',
      zh: '正在验证答案...',
      fr: 'Vérification de votre réponse ...',
      pa: 'ਤੁਹਾਡਾ ਜਵਾਬ ਤਸਦੀਕ ਕਰ ਰਿਹਾ ਹੈ ...',
    },
    errorRetrievingImg: {
      en: 'Error happened while retrieving CAPTCHA image. please {{click here}} to try again',
      zh: '验证码下载错误。请{{点击这里}}重试',
      fr: `Une erreur s'est produite lors de la récupération de l'image CAPTCHA. s'il vous plaît {{cliquez ici}} pour réessayer`,
      pa: 'ਕੈਪਟਚਾ ਚਿੱਤਰ ਨੂੰ ਪ੍ਰਾਪਤ ਕਰਦੇ ਸਮੇਂ ਤਰੁੱਟੀ ਉਤਪੰਨ ਹੋਈ. ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰਨ ਲਈ {{ਇੱਥੇ ਕਲਿਕ ਕਰੋ}}',
    },
    errorVerifyingAnswer: {
      en: 'Error happened while verifying your answer. please {{click here}} to try again',
      zh: '验证答案过程发生错误。请{{点击这里}}重试',
      fr: `Une erreur s'est produite lors de la vérification de votre réponse. s'il vous plaît {{cliquez ici}} pour réessayer`,
      pa: 'ਤੁਹਾਡਾ ਜਵਾਬ ਤਸਦੀਕ ਕਰਨ ਵੇਲੇ ਗਲਤੀ ਆਈ ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰਨ ਲਈ {{ਇੱਥੇ ਕਲਿਕ ਕਰੋ}}',
    },
  };

  /**
   * Http error response for fetching a CAPTCHA image.
   */
  errorFetchingImg = null;

  /**
   * Http error response for verifying user's answer.
   */
  errorVerifyAnswer = null;

  private validation = '';
  audio = '';
  answer = '';
  state: CAPTCHA_STATE;
  incorrectAnswer: boolean;
  fetchingAudioInProgress = false;

  /**
   * Subject used to unsubscribe to all observables.
   */
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

  private verifySub: Subscription = null;
  private audioSub: Subscription = null;
  private dataSub: Subscription = null;

  constructor(
    private dataService: SupplierHttpService,
    private cd: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.forceRefresh.bind(this);
    window['ca.bcgov.captchaRefresh'] = this.publicForceRefresh.bind(this);

    // if(!this.userPromptMessage) {
    //   this.userPromptMessage = 'Enter the text you either see in the box or you hear in the audio';
    // }
  }

  ngAfterViewInit() {
    this.forceRefresh();
  }

  ngOnChanges(changes: SimpleChanges) {
    // when changing language, if audio is empty then no need to refresh
    if (!changes.language || !this.audio || this.audio.length === 0) {
      if (
        !(
          changes.reloadCaptcha &&
          (true === changes.reloadCaptcha.previousValue ||
            false === changes.reloadCaptcha.previousValue) &&
          changes.reloadCaptcha.currentValue !==
            changes.reloadCaptcha.previousValue
        )
      ) {
        return;
      }
    }
    this.getNewCaptcha(false);
  }

  ngOnDestroy() {
    // trigger all observables to complete
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  forceRefresh() {
    this.getNewCaptcha(false);
    this.cd.detectChanges();
  }

  publicForceRefresh() {
    this.ngZone.run(() => this.forceRefresh());
  }

  answerChanged(event: any) {
    if (this.answer.length < 6) {
      this.incorrectAnswer = null;
    }

    if (this.answer.length === 6) {
      this.state = CAPTCHA_STATE.VERIFYING_ANSWER;
      this.incorrectAnswer = null;

      // pre-empt existing observable execution
      if (this.verifySub && !this.verifySub.closed) {
        this.verifySub.unsubscribe();
      }

      this.verifySub = this.dataService
        .verifyCaptcha(this.nonce, this.answer, this.validation)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          (response: HttpResponse<any>) => {
            const payload = response.body;
            if (this.isValidPayload(payload)) {
              this.handleVerify(payload);
            } else {
              this.state = CAPTCHA_STATE.ERROR_VERIFY;
              this.errorVerifyAnswer = this.createErrorTextLine(response);
            }
          },
          (error) => {
            this.state = CAPTCHA_STATE.ERROR_VERIFY;
            this.errorVerifyAnswer = this.createErrorTextLine(error);
            console.log('Error response from verifying user answer: ', error);
            // let UI know about error
            this.serverError.emit(error);
          }
        );
    }
  }

  // check if our answer is correct
  private handleVerify(payload: any) {
    // ensure valid payload response is received
    if (payload.valid === true) {
      this.state = CAPTCHA_STATE.SUCCESS_VERIFY_ANSWER_CORRECT;
      this.validToken.emit(payload.jwt);
    } else {
      // should never happen
      this.incorrectAnswer = true;
      this.answer = '';
      this.audio = '';
      // something failed - try a new one
      this.getNewCaptcha(true);
    }
  }

  /**
   * Case where HTTP 200 response code is received by the payload is incorrect or corrupt.
   * The occurance of this type of case should be rare.
   */
  private isValidPayload(payload: any) {
    // console.debug('Response payload: ', payload);
    if (!payload) {
      console.error('Payload cannot be null or undefined or 0');
      return false;
    } else {
      const hasValueProp = payload.hasOwnProperty('valid');
      if (!hasValueProp) {
        console.error("Payload must have its own property named 'valid'");
        return false;
      } else {
        return true;
      }
    }
  }

  playAudio() {
    if (this.audio && this.audio.length > 0) {
      this.audioElement.nativeElement.play();
    } else {
      this.fetchAudio(true);
    }
  }

  private fetchAudio(playImmediately: boolean = false) {
    this.fetchingAudioInProgress = true;

    // pre-empt existing observable execution
    if (this.audioSub && !this.audioSub.closed) {
      this.audioSub.unsubscribe();
    }

    this.audioSub = this.dataService
      .fetchAudio(this.validation, this.language)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: HttpResponse<any>) => {
          this.fetchingAudioInProgress = false;
          this.audio = response.body.audio;
          this.cd.detectChanges();
          if (playImmediately) {
            this.audioElement.nativeElement.play();
          }
        },
        (error) => {
          this.fetchingAudioInProgress = false;
          console.log('Error response from fetching audio CAPTCHA: ', error);
          this.cd.detectChanges();
          // let UI know about error
          this.serverError.emit(error);
        }
      );
  }

  getNewCaptcha(errorCase: boolean) {
    this.state = CAPTCHA_STATE.FETCHING_CAPTCHA_IMG;
    this.audio = '';

    // reset things
    if (!errorCase) {
      // let them know they failed instead of wiping out the answer area
      // NB: contructing this form on page load/reload will have errorCase = false
      this.incorrectAnswer = null;
    }

    // pre-empt existing observable execution
    if (this.dataSub && !this.dataSub.closed) {
      this.dataSub.unsubscribe();
    }

    this.dataSub = this.dataService
      .fetchData(this.nonce)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response: HttpResponse<any>) => {
          this.state = CAPTCHA_STATE.SUCCESS_FETCH_IMG;
          const payload = response.body;
          this.imageContainer.nativeElement.innerHTML = payload.captcha;
          this.validation = payload.validation;
          this.cd.detectChanges();

          if (this.eagerFetchAudio) {
            // console.log('Fetch audio eagerly');
            this.fetchAudio();
          } else {
            // console.log('Not to fetch audio eagerly');
          }
        },
        (error) => {
          this.state = CAPTCHA_STATE.ERROR_FETCH_IMG;
          this.errorFetchingImg = this.createErrorTextLine(error);
          console.log('Error esponse from fetching CAPTCHA text: %o', error);
          this.cd.detectChanges();
          // let UI know about error
          this.serverError.emit(error);
        }
      );
  }

  private createErrorTextLine(error: any) {
    let line = 'Error status: ' + error.status;
    if (error.statusText) {
      line = line + ', status text: ' + error.statusText;
    }
    return line;
  }
}
