import React from 'react';

export default function Comment({comments}) {
  // const [newComment, setNewComment] = useState('');
  

  const timeDifference = (current, previous) => {
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;

    const elapsed = current - previous;

    if (elapsed < msPerMinute) {
      return Math.round(elapsed / 1000) + ' seconds ago';
    } else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + ' minutes ago';
    } else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + ' hours ago';
    } else if (elapsed < msPerMonth) {
      return Math.round(elapsed / msPerDay) + ' days ago';
    } else if (elapsed < msPerYear) {
      return Math.round(elapsed / msPerMonth) + ' months ago';
    } else {
      return Math.round(elapsed / msPerYear) + ' years ago';
    }
  };

  // const handleKeyDown = (event) => {
  //   if (event.key === 'Enter' && newComment.trim() !== '') {
  //     const newCommentObj = {
  //       userImage: "https://wallpapers.com/images/hd/uchiha-itachi-pfp-anime-digital-art-yvx3otzrvsjpgrq6.jpg",
  //       username: "Anonymous",
  //       comment: newComment,
  //       dateCreated: new Date().toISOString()
  //     };
  //     setComments([...comments, newCommentObj]);
  //     setNewComment('');
  //   }
  // };

  return (
    <div className='overflow-auto' style={{ maxHeight: '250px' }}>
    {comments && comments.map(({ image, username, text, dateCreated }) => {
      const timeAgo = timeDifference(new Date(), new Date(dateCreated));
      return (
        <div key={dateCreated} className="d-flex align-items-start flex-column my-2" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '15px', boxShadow: '0px 0px 10px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}>
          {image ? (
            <img src={`data:image/jpeg;base64,${image}`} alt="User" className="rounded-circle mr-2" style={{ width: '2rem', height: '2rem' }} />
          ) : (
            <i className="fas fa-user"></i>
          )}
          <small className="text-muted">{username}</small>
          <p className="mb-0 text-black" style={{ textAlign: 'center' }}>{text}</p>
          <small className="text-muted">{timeAgo}</small> {/* Add the time ago here */}
        </div>
      );
    })}
  </div>
  );
}
