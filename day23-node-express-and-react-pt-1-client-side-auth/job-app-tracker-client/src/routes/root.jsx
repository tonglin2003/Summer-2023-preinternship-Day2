import { Link, Outlet, useNavigation, useLoaderData, Form } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import classNames from "classnames";
import { useEffect, useContext } from "react";

import { AuthContext  } from "../contexts/AuthContext";

export async function loader({request}){
  const response = await fetch("http://localhost:4000/api/auth/current_user");
  if (response.ok){
    const {user} = await response.json();
    return {currentUser: user};
  }
  return {currentUser: null};
}

function Root() {
  const { currentUser } = useLoaderData();
  const { setCurrentUser } = useContext(AuthContext);

  useEffect(() => {
    setCurrentUser(currentUser);
  }, [currentUser]);

  const outletClasses = classNames(
    "mx-auto max-w-4xl sm:px-12 px-4 transition-opacity",
    {
      "opacity-100": navigation.state !== "loading",
      "opacity-50": navigation.state === "loading",
    }
  );
  return (
    <div>
      <nav className="bg-blue-900 h-14 flex justify-items-center">
        <h2 className="flex items-center">
          <Link className="text-2xl flex items-center gap-1 px-2" to="/">
            <FaHome />
            Job Application Tracker
          </Link>
        </h2>
      </nav>

      <div className={outletClasses}>
        <Outlet />
      </div>
    </div>
  );
}

export default Root;
