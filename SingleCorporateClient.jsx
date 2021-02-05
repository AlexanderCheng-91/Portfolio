import React from "react";
import PropTypes from "prop-types";
import "./corporateClients.css";

const SingleCorporateClient = function (props) {
  const oneCorporateClient = props.corporateClient;
  const onCorporateClientDetailClick = () => {
    props.detailClickHandler(oneCorporateClient);
  };

  return (
    <div className="col-lg-4" onClick={onCorporateClientDetailClick}>
      <div className="corporateClientCard">
        <div className="blog-box blog-grid text-center product-box">
          <div className="product-img">
            <img
              src={oneCorporateClient.avatarUrl}
              alt=""
              className="img-fluid top-radius-blog media"
            />
          </div>
          <div className="blog-details-main">
            <ul className="blog-social">
              <li className="digits">
                Name: {oneCorporateClient.firstName} {oneCorporateClient.mi}{" "}
                {oneCorporateClient.lastName}{" "}
              </li>
              <br />
              <li className="digits">
                Company: {oneCorporateClient.companyName}
              </li>
              <br />
              <li className="digits">Phone: {oneCorporateClient.phone}</li>
            </ul>
            <hr />
            <h6 className="blog-bottom-details">
              {oneCorporateClient.location.lineOne}
              {oneCorporateClient.location.lineTwo},
              <br />
              {oneCorporateClient.location.city}.
              {oneCorporateClient.location.zip},
              {oneCorporateClient.location.state.code}
              <hr />
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
};
SingleCorporateClient.propTypes = {
  detailClickHandler: PropTypes.func,
  corporateClient: PropTypes.shape({
    avatarUrl: PropTypes.string,
    id: PropTypes.number,
    firstName: PropTypes.string,
    mi: PropTypes.string,
    lastName: PropTypes.string,
    companyName: PropTypes.string,
    phone: PropTypes.string,
    location: PropTypes.shape({
      lineOne: PropTypes.string,
      lineTwo: PropTypes.string,
      city: PropTypes.string,
      zip: PropTypes.string,
      state: PropTypes.shape({
        code: PropTypes.string,
      }),
    }),
  }),
};
export default React.memo(SingleCorporateClient);
