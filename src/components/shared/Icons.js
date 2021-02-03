export const IconCalendar = (props) => (
  props.direction ?
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M12.25 1.75H11.6667V0.583298C11.6667 0.261368 11.4053 0 11.0833 0H10.5C10.178 0 9.9167 0.261368 9.9167 0.583298V1.75H4.0833V0.583298C4.0833 0.261368 3.82204 0 3.5 0H2.9167C2.59467 0 2.3333 0.261368 2.3333 0.583298V1.75H1.75C0.785172 1.75 0 2.53517 0 3.5V12.25C0 13.2148 0.785172 14 1.75 14H12.25C13.2148 14 14 13.2148 14 12.25V3.5C14 2.53517 13.2148 1.75 12.25 1.75ZM12.8333 12.25C12.8333 12.5714 12.5714 12.8333 12.25 12.8333H1.75C1.4286 12.8333 1.1667 12.5714 1.1667 12.25V5.85669H12.8333V12.25Z" fill={props.color ? props.color : '#5D6F84'} />
    <path d="M13 6L1 13H13V6Z" fill={props.color ? props.color : '#5D6F84'} />
  </svg>
  :
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M12.25 1.75H11.6667V0.583298C11.6667 0.261368 11.4053 0 11.0833 0H10.5C10.178 0 9.9167 0.261368 9.9167 0.583298V1.75H4.0833V0.583298C4.0833 0.261368 3.82204 0 3.5 0H2.9167C2.59467 0 2.3333 0.261368 2.3333 0.583298V1.75H1.75C0.785172 1.75 0 2.53517 0 3.5V12.25C0 13.2148 0.785172 14 1.75 14H12.25C13.2148 14 14 13.2148 14 12.25V3.5C14 2.53517 13.2148 1.75 12.25 1.75ZM12.8333 12.25C12.8333 12.5714 12.5714 12.8333 12.25 12.8333H1.75C1.4286 12.8333 1.1667 12.5714 1.1667 12.25V5.85669H12.8333V12.25Z" fill={props.color ? props.color : '#5D6F84'}/>
    <path d="M1 6L13 13H1V6Z" fill={props.color ? props.color : '#5D6F84'}/>
  </svg>
)

export const IconEth = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="17" viewBox="0 0 10 17" fill="none">
    <path d="M9.83673 9.83667L5.00465 12.7704L0 9.83667L5.00465 16.9122L9.83673 9.83667Z" fill={props.color ? props.color : '#80F0BE'}/>
    <path d="M5.00465 11.2173L0 8.28357L5.00465 0L9.83673 8.28357L5.00465 11.2173Z" fill={props.color ? props.color : '#80F0BE'}/>
  </svg>
)

export const IconDeposit = (props) => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.00001 5.50001L6.5 11L12 5.50001" stroke={props.color ? props.color : '#80F0BE'} strokeWidth="2"/>
    <path d="M6.5 9.77783L6.5 2.4445" stroke={props.color ? props.color : '#80F0BE'} strokeWidth="2"/>
  </svg>
)

export const IconQR = (props) => (
  <svg width={props.size ? (props.size).toString() : '42'} height={props.size ? (props.size).toString() : '42'} viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="13.2852" y="13.2854" width="6.93603" height="6.93603" rx="2.19032" fill={props.color ? props.color : '#B9CDE3'}/>
    <rect x="13.2852" y="22.0464" width="6.93603" height="6.93603" rx="2.19032" fill={props.color ? props.color : '#B9CDE3'}/>
    <rect x="22.0476" y="22.0464" width="6.93603" height="6.93603" rx="2.19032" fill={props.color ? props.color : '#B9CDE3'}/>
    <rect x="22.0476" y="13.2737" width="6.93603" height="6.93603" rx="2.19032" fill={props.color ? props.color : '#B9CDE3'}/>
    <path d="M16.9363 10.0002H15.111C12.2884 10.0002 10.0002 12.2884 10.0002 15.111V16.9363" stroke={props.color ? props.color : '#B9CDE3'} strokeWidth="1.3099"/>
    <path d="M25.3323 32.2683L27.1576 32.2683C29.9801 32.2683 32.2683 29.9801 32.2683 27.1576L32.2683 25.3323" stroke={props.color ? props.color : '#B9CDE3'} strokeWidth="1.3099"/>
    <path d="M10 25.3323L10 27.1576C10 29.9801 12.2882 32.2683 15.1108 32.2683L16.936 32.2683" stroke={props.color ? props.color : '#B9CDE3'} strokeWidth="1.3099"/>
    <path d="M32.2683 16.936L32.2683 15.1108C32.2683 12.2882 29.9801 10 27.1576 10L25.3323 10" stroke={props.color ? props.color : '#B9CDE3'} strokeWidth="1.3099"/>
    { !props.noBorder && <rect x="0.5" y="0.5" width="41" height="41" rx="9.5" stroke={props.color ? props.color : '#B9CDE3'} />}
  </svg>
)

export const IconSearch = (props) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.22226 13.4445C10.6587 13.4445 13.4445 10.6587 13.4445 7.22226C13.4445 3.7858 10.6587 1 7.22226 1C3.7858 1 1 3.7858 1 7.22226C1 10.6587 3.7858 13.4445 7.22226 13.4445Z" stroke={props.color ? props.color : '#5D6F84'} strokeWidth="1.55557" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15.0005 15.0005L11.6172 11.6172" stroke={props.color ? props.color : '#5D6F84'} strokeWidth="1.55557" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const IconAccount = (props) => (
  <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 19V17C17 15.9391 16.5786 14.9217 15.8284 14.1716C15.0783 13.4214 14.0609 13 13 13H5C3.93913 13 2.92172 13.4214 2.17157 14.1716C1.42143 14.9217 1 15.9391 1 17V19" stroke={props.color ? props.color : '#FFFFFF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 9C11.2091 9 13 7.20914 13 5C13 2.79086 11.2091 1 9 1C6.79086 1 5 2.79086 5 5C5 7.20914 6.79086 9 9 9Z" stroke={props.color ? props.color : '#FFFFFF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const IconAdd = (props) => (
  <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18.5" cy="18.5" r="18.5" fill={props.color ? props.color : '#80F0BE'}/>
    <rect x="10.573" y="19.8213" width="2.64286" height="15.8571" transform="rotate(-90 10.573 19.8213)" fill={props.color_2 ? props.color_2 : '#151E27'}/>
    <rect x="19.823" y="26.4287" width="2.64286" height="15.8571" transform="rotate(180 19.823 26.4287)" fill={props.color_2 ? props.color_2 : '#151E27'}/>
  </svg>
)

export const IconList = (props) => (
  <svg width="27" height="18" viewBox="0 0 27 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.157 14.5843C20.9474 14.5843 24.0201 11.5116 24.0201 7.72121C24.0201 3.93085 20.9474 0.858154 17.157 0.858154C13.3666 0.858154 10.2939 3.93085 10.2939 7.72121C10.2939 11.5116 13.3666 14.5843 17.157 14.5843Z" stroke={props.color ? props.color : '#FFFFFF'} strokeWidth="1.71576" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M25.7369 16.3006L22.0051 12.5688" stroke={props.color ? props.color : '#FFFFFF'} strokeWidth="1.71576" strokeLinecap="round" strokeLinejoin="round"/>
    <rect width="8.57882" height="1.71576" rx="0.857882" fill={props.color ? props.color : '#FFFFFF'}/>
    <rect y="6.86328" width="6.00518" height="1.71576" rx="0.857882" fill={props.color ? props.color : '#FFFFFF'}/>
    <rect y="13.7258" width="8.57882" height="1.71576" rx="0.857882" fill={props.color ? props.color : '#FFFFFF'}/>
  </svg>
)

export const IconLocation = (props) => (
  <svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M6.15385 16C6.15385 16 12.3077 9.8039 12.3077 6.31579C12.3077 2.82768 9.55252 0 6.15385 0C2.75517 0 0 2.82768 0 6.31579C0 9.8039 6.15385 16 6.15385 16ZM6.15385 8.61539C7.51332 8.61539 8.61539 7.51332 8.61539 6.15385C8.61539 4.79438 7.51332 3.69231 6.15385 3.69231C4.79438 3.69231 3.69231 4.79438 3.69231 6.15385C3.69231 7.51332 4.79438 8.61539 6.15385 8.61539Z" fill={props.color ? props.color : '#5D6F84'}/>
  </svg>
)

export const IconPlus = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.99951 13.0019L7.99951 1" stroke="#77F2BC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 7.00149L1.99805 7.00149" stroke="#77F2BC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const Arrow = (props) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 7H1" stroke={props.color ? props.color : '#3C8FBD'} strokeWidth="1.71429" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 13L1 7L7 1" stroke={props.color ? props.color : '#3C8FBD'} strokeWidth="1.71429" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const Quantity = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
    <g filter="url(#filter0_d)">
    <path fillRule="evenodd" clipRule="evenodd" d="M5.51275 9.37665C4.65199 9.21731 4.00008 8.46267 4.00008 7.55577L4.00008 3.85182C4.00008 2.82906 4.8292 1.99994 5.85196 1.99994L9.55591 1.99994C10.4627 1.99994 11.2172 2.65163 11.3767 3.51218C11.2667 3.49182 11.1534 3.48118 11.0375 3.48118L7.33355 3.48118C6.31079 3.48118 5.48167 4.3103 5.48167 5.33306L5.48167 9.03701C5.48167 9.15302 5.49234 9.26655 5.51275 9.37665Z" fill={props.color ? props.color : '#4C6581'}/>
    <rect width="7.4077" height="7.4077" rx="1.11113" transform="matrix(-4.37114e-08 -1 -1 4.37114e-08 14 12)" fill={props.color ? props.color : '#4C6581'}/>
    </g>
    <defs>
    <filter id="filter0_d" x="-1.71661e-05" y="0.6666" width="18" height="18.0001" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
    <feOffset dy="2.66668"/>
    <feGaussianBlur stdDeviation="2.00001"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
    </filter>
    </defs>
  </svg>
)

export const QRCodeScaner = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38" fill="none">
  <path d="M0 8C0 3.58172 3.58172 0 8 0H30C34.4183 0 38 3.58172 38 8V30C38 34.4183 34.4183 38 30 38H8C3.58172 38 0 34.4183 0 30V8Z" fill={props.fill ? props.fill : '#1D2834' }/>
  <rect x="11.2061" y="12.2061" width="6.76889" height="6.76889" rx="1.94082" fill={props.color ? props.color : '#BDC9D7'}/>
  <rect x="11.2061" y="20.7563" width="6.76889" height="6.76889" rx="1.94082" fill={props.color ? props.color : '#BDC9D7'}/>
  <rect x="19.7578" y="20.7563" width="6.76889" height="6.76889" rx="1.94082" fill={props.color ? props.color : '#BDC9D7'}/>
  <rect x="19.7578" y="12.1948" width="6.76889" height="6.76889" rx="1.94082" fill={props.color ? props.color : '#BDC9D7'}/>
  <path d="M14.7689 9.00049H12.5286C10.0275 9.00049 8 11.028 8 13.5291V15.7694" stroke={props.color ? props.color : '#BDC9D7'} stroke-width="1.16069"/>
  <path d="M22.9626 30.7314L25.2029 30.7314C27.7039 30.7314 29.7314 28.7039 29.7314 26.2029L29.7314 23.9626" stroke={props.color ? props.color : '#BDC9D7'} stroke-width="1.16069"/>
  <path d="M8 23.9626L8 26.2029C8 28.7039 10.0275 30.7314 12.5286 30.7314L14.7689 30.7314" stroke={props.color ? props.color : '#BDC9D7'} stroke-width="1.16069"/>
  <path d="M29.7314 15.7689L29.7314 13.5286C29.7314 11.0275 27.7039 9 25.2029 9L22.9626 9" stroke={props.color ? props.color : '#BDC9D7'} stroke-width="1.16069"/>
  </svg>
)