import axios from 'axios';
import { 
    PRODUCT_LIST_FAIL, 
    PRODUCT_LIST_REQUEST, 
    PRODUCT_LIST_SUCCESS ,

    PRODUCT_DETAILS_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_CREATE_REVIEW_REQUEST,
    PRODUCT_CREATE_REVIEW_SUCCESS,
    PRODUCT_CREATE_REVIEW_RESET,
    PRODUCT_CREATE_REVIEW_FAIL
} from "../Constants/ProductConstants";
import { logout } from './userAction';


// PRODUCT LIST
export const listProduct = 
    (keyword = " ", pageNumber = " " ) => 
     
    async (dispatch) => {
        try {
            dispatch({ type : PRODUCT_LIST_REQUEST });
             const { data } = await axios.get(`/api/products/?keyword=${keyword}&pageNumber=${pageNumber}`
            //const { data } = await axios.get(`/api/products/search/${keyword}`
                );
            dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
        } catch (error) {
            dispatch({
                type: PRODUCT_LIST_FAIL,
                payload:
                    error.response && error.response.data.message 
                        ? error.response.data.message
                        : error.message,
        });
    }
};

// PRODUCT LIST search
export const listProduct1 = 
    (keyword = " ", pageNumber = " " ) => 
     
    async (dispatch) => {
        console.log("1keyword")
        try {
            dispatch({ type : PRODUCT_LIST_REQUEST });
             //const { data } = await axios.get(`/api/products/?keyword=${keyword}&pageNumber=${pageNumber}`
            const { data } = await axios.get(`/api/products/search?keyword=${keyword}`
                );
            dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
        } catch (error) {
            dispatch({
                type: PRODUCT_LIST_FAIL,
                payload:
                    error.response && error.response.data.message 
                        ? error.response.data.message
                        : error.message,
        });
    }
};

// SINGLE PRODUCT
export const listProductDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type : PRODUCT_DETAILS_REQUEST });
        const { data } = await axios.get(`/api/products/${id}`);
        dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload:
                error.response && error.response.data.message 
                    ? error.response.data.message
                    : error.message,
        });
    }
};

// PRODUCT REVIEW CREATE
export const createProductReview = 
(productId,review) => async (dispatch, getState) => {
    try {
        dispatch({ type : PRODUCT_CREATE_REVIEW_REQUEST });
        const {
            userLogin : {userInfo}
        } = getState();
        const config = {
            headers: {
                "Content-Type":"application/json",
                Authorization:`Bearer ${userInfo.token}`
            },
        };

         await axios.post(
            `/api/products/${productId}/review`,
            review,
            config
            );
        dispatch({ type: PRODUCT_CREATE_REVIEW_SUCCESS});
    } catch (error) {
        const message =  
         error.response && error.response.data.message 
        ? error.response.data.message
        : error.message
        if (message === "Not authorized, token failed") {
            dispatch(logout());
        }
        dispatch({ 
           type: PRODUCT_CREATE_REVIEW_FAIL,
            payload:message
        });
    }
}
