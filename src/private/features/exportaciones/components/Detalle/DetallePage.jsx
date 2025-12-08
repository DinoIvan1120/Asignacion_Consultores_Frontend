import { NavLink, Outlet, useSearchParams, Link,useLocation } from "react-router-dom";

export function DetallePage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);  
  const ticket_id = searchParams.get("ticket_id");
  // const [searchParams] = useSearchParams();


  return (
    <>
      <section className="headbar headbar--abierto">
        <div className="headbar__detail">
          <Link className="establecer" to="/features/seguimiento/tickets">
            <i className="bi bi-arrow-left-circle fondo" />
          </Link>

          <div>
            {/* <em className="ico-element-ficha"></em> */}
            <span>
              <strong>Ticket:</strong> {ticket_id || "N/A"}
            </span>
          </div>
        </div>
      </section>

      <section className="bodyFeature">
        <ul className="bodyFeature__tab">
          <li>
            {/* ✅ Usa ruta relativa */}
            <NavLink exact to={`/features/seguimiento/sgr/general?ticket_id=${ticket_id}`}>
                  General
            </NavLink>
          </li>
        </ul>
        <div className="bodyFeature__tabcnt">
          <Outlet />
        </div>
      </section>
    </>
  );
}
