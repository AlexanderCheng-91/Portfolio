import * as Yup from "yup";
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const corporateClientValidationSchema = Yup.object().shape({




    firstName: Yup.string().required("Enter First Name"),
    lastName: Yup.string().required("Enter Last Name"),
    mi: Yup.string(),
    companyName: Yup.string().required("Enter Company Name"),
    avatarUrl: Yup.string().required("Enter Avatar Url"),
    // location ?
    phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid')
});

export default corporateClientValidationSchema; 
