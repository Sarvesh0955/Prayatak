import { useState, useCallback} from "react";
import LfContext from "./LfContext";

const LfState = (props) => {
  const itemsInitial = [];
  const [items, setItems] = useState(itemsInitial);

  const commentInitial = [];
  const [comments, setComments] = useState(commentInitial);

  const addComment = async (username,commentText) => {
    const url = "http://localhost:8080/lf/addcomment";
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, commentText }), 
    });

    if (response.ok) {
        const result = await response.json();
        alert(result.message);
    } else {
        console.error('Error sending data:', response.statusText);
    }
};
  const addClaim = async (id,description,phone) => {
    const url = "http://localhost:8080/lf/claim-item";
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id,description,phone }), 
    });

    if (response.ok) {
        const result = await response.json();
        alert("Claim Submitted , we will contact you soon ! ");
    } else {
        console.error('Error sending data:', response.statusText);
    }
};

const getComments = async () => {
  const url = "http://localhost:8080/lf/lfcomments";
  const response = await fetch(url, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
  });

  if (response.ok) {
      const json = await response.json();
      console.log(json);
      setComments(json);
  } else {
      console.error('Error fetching data:', response.statusText);
  }
};


  const getItems = useCallback(async () => {
    try {
      const url = "http://localhost:8080/lf/items";
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const json = await response.json();

      const itemsWithFullPhotoUrl = json.map(item => ({
        ...item,
        photo: `${item.photo}`
      }));
  
      setItems(itemsWithFullPhotoUrl);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  }, []);
  const getItemsByType = useCallback(async (type) => {
    try {
        const url = `http://localhost:8080/lf/type/${type}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch items');
        }

        const json = await response.json();
        const itemsWithFullPhotoUrl = json.map(item => ({
            ...item,
            photo: item.photo ? `http://localhost:8080${item.photo}` : "#", // Handle potential undefined photo
        }));

        setItems(itemsWithFullPhotoUrl);
    } catch (error) {
        console.error("Error fetching items:", error);
    }
}, [setItems]);
  const getItemsByLocation = useCallback(async (location) => {
    try {
        const url = `http://localhost:8080/lf/location/${location}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch items');
        }

        const json = await response.json();
        const itemsWithFullPhotoUrl = json.map(item => ({
            ...item,
            photo: item.photo ? `http://localhost:8080${item.photo}` : "#", 
        }));

        setItems(itemsWithFullPhotoUrl);
    } catch (error) {
        console.error("Error fetching items:", error);
    }
}, [setItems]);
const getItemsBySearch = async (filters) => {
  try {
    // Convert filters into query parameters
    const queryParams = new URLSearchParams(filters).toString();
    
    const response = await fetch(`http://localhost:8080/lf/search?${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching filtered items: ${response.statusText}`);
    }
    
    const data = await response.json();
    setItems(data);
  } catch (error) {
    console.error('Error fetching filtered items:', error);
  }
};
const getItemById = async (id) => {
  const response = await fetch(`http://localhost:8080/lf/items/${id}`);
  const data = await response.json();
  return data;
};

  

  const addItems = async (landf, type, description, location, date, photo, contact,name,email) => {
    const url = "http://localhost:8080/lf/items";
    
    // Create a FormData object
    const formData = new FormData();
    formData.append('landf', landf);
    formData.append('type', type);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('date', date);
    formData.append('photo', photo); // Append the photo file
    formData.append('contact', contact);
    formData.append('name', name);
    formData.append('email', email);

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData // Use FormData as the body
        });

        if (!response.ok) {
            throw new Error('Failed to add item');
        }
        alert("Report Submitted SuccessFuly");
        const json = await response.json();
        setItems(items.concat(json));  
    } catch (error) {
        console.error("Error adding item:", error);
    }
};
  return (
    <LfContext.Provider value={{ items,addClaim, getItems,addItems,getItemsByType,getItemsByLocation,getItemsBySearch,addComment,comments,getComments,getItemById }}>
      {props.children}
    </LfContext.Provider>
  );
};

export default LfState;
